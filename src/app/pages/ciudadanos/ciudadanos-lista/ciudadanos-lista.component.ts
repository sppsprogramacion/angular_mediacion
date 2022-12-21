import { Component, OnInit } from '@angular/core';
import { CiudadanoModel } from '../../../models/ciudadano.model';
import { DepartamentoModel } from '../../../models/departamento.model';
import { MunicipioModel } from '../../../models/municipio.model';
import { SexoModel } from '../../../models/sexo.model';
import { CiudadanosService } from '../../../service/ciudadanos.service';

@Component({
  selector: 'app-ciudadanos',
  templateUrl: './ciudadanos-lista.component.html',
  styleUrls: ['./ciudadanos-lista.component.scss']
})
export class CiudadanosListaComponent implements OnInit {

  loading:boolean = true;

  //VARIABLES TRAMITE    
  ciudadano: CiudadanoModel;
  ciudadanoDialog: boolean;
  nuevoCiudadano: boolean;
  submitted: boolean;

  //LISTAS    
  listCiudadanos: CiudadanoModel[]=[];
  listDepartamentos: DepartamentoModel[]=[];
  listMunicipios: MunicipioModel[]= [];
  listSexo: SexoModel[]=[];

  constructor(
    private ciudadanosService: CiudadanosService
  ) { }

  ngOnInit(): void {
    this.listarCiudadanos();
    
  }


  //LISTADO DE CIUDADANOS
  listarCiudadanos(){    
    this.ciudadanosService.listarCiudadanosTodos().
        subscribe(respuesta => {
        this.listCiudadanos= respuesta[0];
        console.log("ciudadanos", this.listCiudadanos);
        this.loading = false;  
    
    });
  }
  //FIN LISTADO DE CIUDADANOS....................................................... 

}
