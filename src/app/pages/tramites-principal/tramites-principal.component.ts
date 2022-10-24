import { Component, OnInit } from '@angular/core';
import { DepartamentoModel } from 'src/app/models/departamento.model';
import { MunicipioModel } from 'src/app/models/municipio.model';
import { SexoModel } from 'src/app/models/sexo.model';
import { TramiteModel } from '../../models/tramite.model';
import { TramitesService } from '../../service/tramites.service';

@Component({
  selector: 'app-tramites-principal',
  templateUrl: './tramites-principal.component.html',
  styleUrls: ['./tramites-principal.component.scss']
})
export class TramitesPrincipalComponent implements OnInit {

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


  //LISTADO DE CIUDADANOS
  listarTramites(){    
    this.tramitesService.listarTramitesTodos().
        subscribe(respuesta => {
        this.listTramites= respuesta[0];
        console.log("tramites", this.listTramites);
        this.loading = false;  
    
    });
}
//FIN LISTADO DE CIUDADANOS....................................................... 

}
