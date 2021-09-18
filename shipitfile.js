module.exports = (shipit) => {
  require("shipit-deploy")(shipit);
  const branch = require("git-branch");

  shipit.initConfig({
    default: {
      deployTo: "/var/projects/ionic",
      repositoryUrl:
        "git@github.com:MISW-4102-ProcesosDeDesarrolloAgil/MISW4201-202114-Grupo10.git",
      keepReleases: 2,
      shallowClone: true,
      copy: false,
    },
    staging: {
      servers: "ubuntu@staging.javoweb.io",
      branch: "main",
      envConfig: "staging",
    },
    sandbox: {
      servers: "ubuntu@sandbox.javoweb.io",
      branch: branch.sync(),
      envConfig: "sandbox",
    },
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
      cwd: `${shipit.releasePath}/frontend`,
    });
    await shipit.remote(`npm run build -- --configuration=${shipit.config.envConfig}`, {
      cwd: `${shipit.releasePath}/frontend`,
    });
  });

  shipit.blTask("ionic:build:backend", async () => {
    await shipit.remote("python3 -m venv .venv", {
      cwd: shipit.releasePath,
    });
    await shipit.remote("source .venv/bin/activate && pip install wheel", {
      cwd: shipit.releasePath,
    });
    await shipit.remote(
      "source .venv/bin/activate && pip install -r requirements.txt",
      { cwd: shipit.releasePath }
    );
  });

  shipit.blTask("ionic:restart", async () => {
    await shipit.remote("sudo systemctl restart ionic-backend.service", {
      tty: true,
    });
  });
};
