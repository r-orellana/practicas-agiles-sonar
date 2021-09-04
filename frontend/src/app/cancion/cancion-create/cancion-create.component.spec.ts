/* tslint:disable:no-unused-variable */
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import {Cancion } from '../cancion'
import { CancionCreateComponent } from './cancion-create.component';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { CancionService } from '../cancion.service';
import { of } from 'rxjs';
import { IndividualConfig, ToastrService } from 'ngx-toastr';




describe('CancionCreateComponent', () => {


  let component: CancionCreateComponent;
  let fixture: ComponentFixture<CancionCreateComponent>;
  let cancionService: CancionService;
  let cancion: Cancion = {
    titulo : 'Test Titulo',
    interprete : 'Test interprete',
    minutos : 5,
    segundos : 12,
    usuario : 1,
    id: 0,
    albumes: []
  };


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
      declarations: [ CancionCreateComponent ],
      providers: [CancionService,
        { provide: ActivatedRoute, useValue:
          {
            snapshot: { params: { userID: 1} }
          }
        },
        { provide: Router, useClass: class { navigate = jasmine.createSpy("navigate"); } },
        { provide : ToastrService,
          useValue : toastrService
        },
        { provide: FormBuilder, useValue: formBuilder }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancionCreateComponent);
    cancionService = TestBed.inject(CancionService);
    spyOn(cancionService, 'crearCancion').and.returnValue(of(cancion));
    component = fixture.componentInstance;
    component.cancionForm =  formBuilder.group({
      titulo: ["", [Validators.required, Validators.maxLength(128)]],
      minutos: ["", [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(2)]],
      segundos: ["", [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(2)]],
      interprete: ["", [Validators.required, Validators.maxLength(128)]]
    })
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
