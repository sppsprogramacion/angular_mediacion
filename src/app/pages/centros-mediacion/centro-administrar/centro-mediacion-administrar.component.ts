import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { CentroMediacionModel } from '../../../models/centro_mediacion.model';

@Component({
  selector: 'app-centro-administrar',
  templateUrl: './centro-mediacion-administrar.component.html',
  styleUrls: ['./centro-mediacion-administrar.component.scss']
})
export class CentroAdministrarComponent implements OnInit {

  //MODELOS
  dataCentroMediacion: CentroMediacionModel= new CentroMediacionModel;
  //dataUsuarioCentro: Usua= new UsuarioTramiteModel;

  constructor(
    private readonly datePipe: DatePipe,
    public dataService: DataService,
  ) {
    //OBTENER EL TRAMITE
    this.dataCentroMediacion= dataService.centroMediacionData;
  }

  ngOnInit(): void {
  }

}
