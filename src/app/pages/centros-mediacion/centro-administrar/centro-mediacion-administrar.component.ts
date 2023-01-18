import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import Swal from 'sweetalert2';
import { CentroMediacionModel } from '../../../models/centro_mediacion.model';
import { UsuarioCentroModel } from '../../../models/usuario_centro.model ';
import { UsuariosCentroService } from '../../../service/usuarios-centro.service';

@Component({
  selector: 'app-centro-administrar',
  templateUrl: './centro-mediacion-administrar.component.html',
  styleUrls: ['./centro-mediacion-administrar.component.scss']
})
export class CentroAdministrarComponent implements OnInit {
  loading: boolean = true
  //MODELOS
  dataCentroMediacion: CentroMediacionModel= new CentroMediacionModel;
  //dataUsuarioCentro: Usua= new UsuarioTramiteModel;

  //LISTAS    
  listUsuariosCentro: UsuarioCentroModel[]=[];
  // listDepartamentos: DepartamentoModel[]=[];
  // listMunicipios: MunicipioModel[]=[];
  // filtroDepartamentos: FiltroModel[]=[];
  // filtroMunicipios: FiltroModel[]=[];

  constructor(
    private readonly datePipe: DatePipe,
    public dataService: DataService,
    private usuariosCentrosService: UsuariosCentroService
  ) {
    //OBTENER EL TRAMITE
    this.dataCentroMediacion= dataService.centroMediacionData;

  }

  ngOnInit(): void {
    this.listarUsuariosCentroMediacion();
  }
  //FIN ONINIT................................................

  //LISTADO DE USUARIOS - CENTRO DE MEDIACION
  listarUsuariosCentroMediacion(){        
    this.usuariosCentrosService.listarUsuariosXCentro(this.dataCentroMediacion.id_centro_mediacion).
      subscribe({
        next: (resultado) => {
          this.listUsuariosCentro = resultado[0]
          this.loading = false
        },
        error: (err) => {
          Swal.fire('Error al listar los usuarios',`${err.error.message}`,"error");
        } 
      })      
  }
  //FIN LISTADO DE CENTROS DE MEDIACION.......................................................

}
