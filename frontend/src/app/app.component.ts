import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ionic';

  constructor(private routerPath: Router, private router: ActivatedRoute) { }

  toggleMenuHandler() {
    const sidebar = document.getElementById('sidebar-wrapper')
    if (!sidebar?.classList.contains('sb-sidenav-toggled')) {
      sidebar?.classList.add('sb-sidenav-toggled')
    } else {
      sidebar?.classList.remove('sb-sidenav-toggled')
    }
  }
  goTo(menu: string) {
    const userId = parseInt(this.router.snapshot.params.userId) || localStorage.getItem('userId');
    const token = this.router.snapshot.params.userToken || localStorage.getItem('authToken');
    if (menu === 'logIn') {
      localStorage.removeItem('authToken')
      localStorage.removeItem('userId')
      this.routerPath.navigate([`/`]);
    } else if (menu === 'album') {
      this.routerPath.navigate([`/albumes/${userId}/${token}`]);
      this.toggleMenuHandler()
    } else if (menu === 'about') {
      this.routerPath.navigate([`/acerca-de-nosotros`])
      this.toggleMenuHandler()
    } else {
      this.routerPath.navigate([`/canciones/${userId}/${token}`]);
      this.toggleMenuHandler()
    }

  }
}
