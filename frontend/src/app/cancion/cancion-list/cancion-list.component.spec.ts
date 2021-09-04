/* tslint:disable:no-unused-variable */
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import {Cancion } from '../cancion'
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { CancionService } from '../cancion.service';
import { of } from 'rxjs';
import { IndividualConfig, ToastrService } from 'ngx-toastr';



import { CancionListComponent } from './cancion-list.component';

describe('CancionListComponent', () => {
  let component: CancionListComponent;
  let fixture: ComponentFixture<CancionListComponent>;

  let cancionService: CancionService;
  let canciones: Array<Cancion> = [
    {
    titulo : 'Test Titulo1',
    interprete : 'Test interprete',
    minutos : 5,
    segundos : 12,
    usuario : 1,
    id: 1,
    albumes: []
  },
  {
    titulo : 'Test Titulo2',
    interprete : 'Test interprete',
    minutos : 5,
    segundos : 12,
    usuario : 1,
    id: 2,
    albumes: []
  }
  ];


  const toastrService = {
    success: (
      message?: string,
      title?: string,
      override?: Partial<IndividualConfig>
    ) => {},
    error: (
      message?: string,
      title?: string,
      override?: Partial<IndividualConfig>
    ) => {},
  };

  const formBuilder: FormBuilder = new FormBuilder();



  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule , ReactiveFormsModule],
      declarations: [ CancionListComponent ],
      providers: [CancionService,
        { provide: ActivatedRoute, useValue:
          {
            snapshot: { params: { userID: 1} }
          }
        },
        { provide: Router, useClass: class { navigate = jasmine.createSpy("navigate"); } },
        { provide : ToastrService,
          useValue : toastrService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancionListComponent);
    cancionService = TestBed.inject(CancionService);
    spyOn(cancionService, 'getCanciones').and.returnValue(of(canciones));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
