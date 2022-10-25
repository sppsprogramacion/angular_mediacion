import { Component, OnInit } from '@angular/core';
import { DepartamentoModel } from 'src/app/models/departamento.model';
import { MunicipioModel } from 'src/app/models/municipio.model';
import { SexoModel } from 'src/app/models/sexo.model';
import { TramiteModel } from 'src/app/models/tramite.model';
import { TramitesService } from 'src/app/service/tramites.service';

@Component({
  selector: 'app-tramites-asignados',
  templateUrl: './tramites-asignados.component.html',
  styleUrls: ['./tramites-asignados.component.scss']
})
export class TramitesAsignadosComponent implements OnInit {

  loading:boolean = true;

  //VARIABLES TRAMITE    
  tramite: TramiteModel;
  tramiteDialog: boolean;
  nuevoTramite: boolean;
  submitted: boolean;

  //LISTAS    
  listTramites: TramiteModel[]=[];
  listDepartamentos: DepartamentoModel[]=[];
  listMunicipios: MunicipioModel[]= [];
  listSexo: SexoModel[]=[];

  constructor(
    private tramitesService: TramitesService
  ) { }

  ngOnInit(): void {
    this.listarTramites();
    
  }


  //LISTADO DE TRAMITES ASIGNADOS
  listarTramites(){    
    this.tramitesService.listarTramitesAsignadosMediador().
        subscribe(respuesta => {
        this.listTramites= respuesta[0];
        this.loading = false;  
    
    });
  }
  //FIN LISTADO DE TRAMITES ASIGNADOS.......................................................

}
