import { Component, OnInit, AfterViewInit } from '@angular/core';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'app-sidenav',
  templateUrl: 'sidenav.component.html',
  styleUrls: ['sidenav.component.css']
})

export class SideNavComponent implements OnInit, AfterViewInit {
  isteacher: any;
  dashboard1: any[] = [];
  dashboard2: any[] = [];

  public adminDashboardMenu1: any[] = [
    {
      title: 'Categories',
      icon: 'fa fa-folder',
      path: '/dashboard/categories'
    },
    {
      title: 'Majoring',
      icon: 'fa fa-book',
      path: '/dashboard/majoring'
    },
    {
      title: 'Questions',
      icon: 'fa fa-question-circle',
      path: '/dashboard/questions'
    },
    {
      title: 'Teachers',
      icon: 'fa fa-user',
      path: '/dashboard/teachers'
    },
    {
      title: 'Students',
      icon: 'fa fa-users',
      path: '/dashboard/students'
    }
  ]

  public adminDashboard2ndMenu2: any[] = [
    {
      title: 'User Mngmnt',
      icon: 'fa fa-user-circle-o',
      path: '/dashboard/usermngmnt'
    },
    // {
    //   title: 'Exam Timer',
    //   icon: 'fa fa-clock-o',
    //   path: '/dashboard/set-timer'
    // }
  ]

  public teacherDashboardMenu1: any[] = [
    {
      title: 'Categories',
      icon: 'fa fa-folder',
      path: '/dashboard/categories'
    },
    {
      title: 'Majoring',
      icon: 'fa fa-book',
      path: '/dashboard/majoring'
    },
    {
      title: 'Questions',
      icon: 'fa fa-question-circle',
      path: '/dashboard/questions'
    }
  ]

  public teacherDashboard2ndMenu2: any[] = [
    {}
  ]

  constructor() {
    if (JSON.parse(localStorage.getItem('currentUser')) != null) {
      this.isteacher = JSON.parse(localStorage.getItem('currentUser')).user[0].isteacher;

      this.dashboard1 = (this.isteacher == 0 ? this.adminDashboardMenu1 : this.teacherDashboardMenu1);
      this.dashboard2 = (this.isteacher == 0 ? this.adminDashboard2ndMenu2 : null);
    }

  }

  ngOnInit() { }

  ngAfterViewInit() {
    $(document).on('click', '.list-group a', function () {

      $('.list-group-item').removeClass("active");

      navSelection();

      return false;
    });

    function navSelection() {
      //$(this).addClass("active");
      if (window.location.pathname == '/dashboard/categories') {
        $('.list1 a:first-child').addClass('active');
      } else if (window.location.pathname == '/dashboard/majoring') {
        $('.list1 a:nth-child(2)').addClass('active');
      } else if (window.location.pathname == '/dashboard/questions') {
        $('.list1 a:nth-child(3)').addClass('active');
      } else if (window.location.pathname == '/dashboard/teachers') {
        $('.list1 a:nth-child(4)').addClass('active');
      } else if (window.location.pathname == '/dashboard/students') {
        $('.list1 a:nth-child(5)').addClass('active');
      } else if (window.location.pathname == '/dashboard/usermngmnt') {
        $('.list2 a:first-child').addClass('active');
      } else if (window.location.pathname == '/dashboard/set-timer') {
        $('.list2 a:nth-child(2)').addClass('active');
      }
    }

    navSelection();
  }
}