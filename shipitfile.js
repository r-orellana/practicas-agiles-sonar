module.exports = (shipit) => {
    require("shipit-deploy")(shipit);
    require("shipit-shared")(shipit);
  
    shipit.initConfig({
      default: {
        deployTo: "/var/projects/ionic",
        repositoryUrl: "git@github.com:MISW-4102-ProcesosDeDesarrolloAgil/MISW4201-202114-Grupo10.git",
        keepReleases: 2,
        shallowClone: true,
        copy: false,
        shared: {
          overwrite: true,
          files: ["backend/tutorial_canciones.db"]
        }
      },
      staging: {
        servers: "ubuntu@staging.javoweb.io",
        branch: "main",
      }
    });
  
    shipit.on("updated", () => {
      shipit.start("ionic:build");
    });
  
    shipit.on("published", () => {
      shipit.start("ionic:restart");
    });
  
    shipit.blTask("ionic:build", async () => {
      await shipit.start(["ionic:build:backend", "ionic:build:frontend"]);
    });
  
    shipit.blTask("ionic:build:frontend", async () => {
      await shipit.remote("npm install production", {
        cwd: `${shipit.releasePath}/frontend`
      });
      await shipit.remote("NODE_ENV=production npm run build", {
        cwd: `${shipit.releasePath}/frontend`
      });
    });
  
    shipit.blTask("ionic:build:backend", async () => {
      await shipit.remote("python3 -m venv .venv", {
        cwd: shipit.releasePath
      });
      await shipit.remote(
        "source .venv/bin/activate && pip install wheel",
        { cwd: shipit.releasePath }
      );
      await shipit.remote(
        "source .venv/bin/activate && pip install -r requirements.txt",
        { cwd: shipit.releasePath }
      );
    });
  
    shipit.blTask("ionic:restart", async () => {
      await shipit.remote("sudo systemctl restart ionic-backend.service", { tty: true });
      await shipit.remote("sudo systemctl restart ionic-frontend.service", { tty: true });
    });
  };