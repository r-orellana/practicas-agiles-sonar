import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { formatTime } from 'src/utils/formatTime';
import { Album } from '../album';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.css']
})
export class AlbumDetailComponent implements OnInit {

  @Input() album: Album | null;
  @Output() deleteAlbum = new EventEmitter();

  userId: number;
  token: string;
  formatTimeFunction: typeof formatTime  = formatTime;

  constructor(
    private routerPath: Router,
    private router: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.userId = parseInt(this.router.snapshot.params.userId)
    this.token = this.router.snapshot.params.userToken
  }

  goToEdit() {
    this.routerPath.navigate([`/albumes/edit/${this.album?.id}/${this.userId}/${this.token}`])
  }

  goToJoinCancion() {
    this.routerPath.navigate([`/albumes/join/${this.album?.id}/${this.userId}/${this.token}`])
  }

  eliminarAlbum() {
    this.deleteAlbum.emit(this.album?.id)
  }

  goToShareAlbum() {
    this.routerPath.navigate([`/albumes/share/${this.album?.id}/${this.userId}/${this.token}`])
  }

  goToCommentAlbum() {
    this.routerPath.navigate([`/albumes/comment/${this.album?.id}/${this.userId}/${this.token}`])
  }

}
