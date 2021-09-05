import { Component, OnInit } from '@angular/core';
import { Usuario } from '../usuario';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UsuarioService } from '../usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario-login',
  templateUrl: './usuario-login.component.html',
  styleUrls: ['./usuario-login.component.css'],
})
export class UsuarioLoginComponent implements OnInit {
  helper = new JwtHelperService();

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  error: boolean = false;

  ngOnInit() {
    document.getElementById('sidebar-wrapper')?.classList.add('sb-sidenav-toggled')
    document.getElementById('sidebarToggle')?.classList.add('sb-sidenav-toggled')
    return;
  }

  onLogInUsuario(nombre: string, contrasena: string) {
    this.error = false;

    this.usuarioService.userLogIn(nombre, contrasena).subscribe(
      (res) => {
        const decodedToken = this.helper.decodeToken(res.token);
        localStorage.setItem('authToken', res.token);
        localStorage.setItem('userId', decodedToken.sub);

        this.router.navigate([`/albumes/${decodedToken.sub}/${res.token}`]);
        document.getElementById('sidebar-wrapper')?.classList.add('sb-sidenav-toggled')
        document.getElementById('sidebarToggle')?.classList.remove('sb-sidenav-toggled')
      },
      (error) => {
        this.error = true;
      }
    );
  }
}
