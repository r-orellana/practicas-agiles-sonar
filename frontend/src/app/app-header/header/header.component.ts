import { Component, Input, OnInit } from '@angular/core';
import {  NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {

  userName: string | any;
  userAvatar: string;
  showUserName : boolean;

  constructor(private router: Router) {


    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.initUserDetails();
      }
    });



  }

  initUserDetails()
  {
    this.showUserName=false;
    if(localStorage.getItem('userName') && localStorage.getItem('userName')!="")
    {
      this.userName = localStorage.getItem('userName');
      this.userAvatar = "https://i.pravatar.cc/150?u=" + this.userName+".ionic";
      this.showUserName=true;
    }
  }


 fastHashParams(args: string) {

    var hash = 0;
    if (args.length == 0) {
        return hash;
    }
    for (var i = 0; i < args.length; i++) {
        var char = args.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return String(hash);
}



  @Input() isSidenavToggled = false;
  @Input() handleToggleMenu: any;


  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.initUserDetails();
      }
    });

    return;
  }
}
