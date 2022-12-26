import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DepartamentoModel } from 'src/app/models/departamento.model';
import { MunicipioModel } from 'src/app/models/municipio.model';
import { SexoModel } from 'src/app/models/sexo.model';
import { TramiteModel } from 'src/app/models/tramite.model';
import { DataService } from 'src/app/service/data.service';
import { TramitesService } from 'src/app/service/tramites.service';

@Component({
  selector: 'app-tramites-finalizados',
  templateUrl: './tramites-finalizados.component.html',
  styleUrls: ['./tramites-finalizados.component.scss']
})
export class TramitesFinalizadosComponent implements OnInit {

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
    private tramitesService: TramitesService,
    public dataService: DataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.listarTramites();
    
  }


  //LISTADO DE TRAMITES FINALIZADOS
  listarTramites(){    
    this.tramitesService.listarTramitesFinalizados().
        subscribe(respuesta => {
        this.listTramites= respuesta[0];
        this.loading = false;  
    
    });
  }
  //FIN LISTADO DE TRAMITES FINALIZADOS.......................................................
  //ACCEDER A DATA SERVICE
  administrarTramite(data: TramiteModel){
    this.dataService.tramiteData = data;
    this.router.navigateByUrl("admin/tramites/administrar");
  }
  //FIN ACCEDER A DATA SERVICE

}
