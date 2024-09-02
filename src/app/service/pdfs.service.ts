import { Injectable } from '@angular/core';
import { Canvas, Cell, Img, PdfMakeWrapper, Rect, Txt } from 'pdfmake-wrapper';
import { TramiteModel } from '../models/tramite.model';
import { AudienciaModel } from '../models/audiencia.model';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PdfsService {

  constructor(    
    private readonly datePipe: DatePipe,

  ) { }


  //CREAR PDF solicitud DEL TRAMITE
  async generarPdfSolicitudTramite(dataTramite: TramiteModel, listAudienciasActivas: AudienciaModel[]) {
    let meses_texto=["Enero", "Febrero","Marzo","Abril","Mayo","Junio", "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    
    //fecha completa
    let fecha_hoy: Date = new Date();
    let fecha_completa: string;
    let fecha: string;
    let anio:number= fecha_hoy.getFullYear(); 
    let mes: number= fecha_hoy.getMonth();
    let dia: number= fecha_hoy.getDate();
    fecha_completa = "Salta, " + dia + " de " + meses_texto[mes] + " de " +  anio;
    
    const pdf = new PdfMakeWrapper();
    pdf.pageMargins([45,40])

    //Rectangulos
    pdf.add(
      new Canvas([
        // Bottom
        new Rect([35, 170], [510, 600]).lineColor('#000000').end,
        new Rect([40, 195], [500, 25]).lineColor('#000000').end,
        new Rect([40, 245], [500, 55]).lineColor('#000000').end,
        new Rect([40, 330], [500, 55]).lineColor('#000000').end,
        new Rect([40, 415], [500, 120]).lineColor('#000000').end,
      ]).absolutePosition(0, 0).end
    );
    
    
    //agrega imagen
    pdf.add( await new Img('../../../assets/imagenes/general/logo-gobierno-salta.png').fit([120,120]).alignment('left').build());
    pdf.add(
      new Txt(fecha_completa).fontSize(11).alignment('right').end      
    );

    pdf.add(' ');

    pdf.add(
      new Txt('Solicitud de mediación').bold().fontSize(14).alignment('center').end
    );

    pdf.add(' ');
    
    pdf.add(
      new Txt('Datos principales').bold().fontSize(12).alignment('left').end
    );

    pdf.add(' ');

    pdf.add({      
      columns: [
        new Cell (new Txt( 'Tramite N°: ').bold().fontSize(11).end).width(60).end,
        new Cell (new Txt( dataTramite.numero_tramite.toString() ).fontSize(11).end).width(90).end,
        new Cell (new Txt('Fecha inicia: ').bold().fontSize(11).end).width(65).end,
        new Cell (new Txt( this.datePipe.transform(dataTramite.fecha_tramite, "dd/MM/yyyy") ).fontSize(11).end).width(90).end,
        new Cell (new Txt('Expediente: ').bold().fontSize(11).end).width(60).end,
        new Cell (new Txt( dataTramite.expediente ).fontSize(11).end).width(150).end
      ]
    });    

    pdf.add(' ');

    //solicitante
    pdf.add(
      new Txt('Solicitante').bold().fontSize(12).alignment('left').end
    );

    pdf.add(' ');

    pdf.add({
      columns: [
        new Cell (new Txt('Nombre: ').bold().fontSize(11).end).width(45).end,
        new Cell (new Txt(dataTramite.ciudadano.apellido + ' ' + dataTramite.ciudadano.nombre).fontSize(11).end).width(310).end,
        new Cell (new Txt('DNI: ').bold().fontSize(11).end).width(25).end,
        new Cell (new Txt( dataTramite.ciudadano.dni.toString()).fontSize(11).end).width(85).end
      ]
    });    

    pdf.add(' ');
    
    pdf.add({      
      columns: [
        new Cell (new Txt('Sexo: ').bold().fontSize(11).end).width(30).end,
        new Cell (new Txt( dataTramite.ciudadano.sexo.sexo ).fontSize(11).end).width(80).end,
        new Cell (new Txt('Teléfono: ').bold().fontSize(11).end).width(50).end,
        new Cell (new Txt( dataTramite.ciudadano.telefono.toString() ).fontSize(11).end).width(90).end,
        new Cell (new Txt('Email: ').bold().fontSize(11).end).width(35).end,
        new Cell (new Txt( dataTramite.ciudadano.email.toString() ).fontSize(11).end).border([true]).width(210).end
      ]
    });    

    pdf.add(' ');

    //motivo
    pdf.add(
      new Txt('Motivo de la solicitud').bold().fontSize(12).alignment('left').end
    );

    pdf.add(' ');

    let existe_violencia: string = "NO";
    let existe_violencia_genero: string = "NO";
    let existe_denuncia: string = "NO";
    let existe_cautelar: string = "NO";
    if (dataTramite.violencia_partes){
      existe_violencia = "SI";
    }
    if (dataTramite.violencia_genero){
      existe_violencia_genero = "SI";
    }
    if (dataTramite.existe_denuncia){
      existe_denuncia = "SI";
    }
    if (dataTramite.medida_cautelar){
      existe_cautelar = "SI";
    }
      
    pdf.add({
      columns: [
        new Cell (new Txt('Motivo: ').bold().fontSize(11).end).width(40).end,
        new Cell (new Txt(dataTramite.objeto.objeto ).fontSize(11).end).width(300).end,    
        new Cell (new Txt('Existe violencia: ').bold().fontSize(11).end).width(85).end,
        new Cell (new Txt( existe_violencia ).fontSize(11).end).width(30).end    
      ]
    });    
    pdf.add(' ');

    pdf.add({
      columns: [
        new Cell (new Txt( 'Existe violencia de género: ').bold().fontSize(11).end).width(135).end,
        new Cell (new Txt( existe_violencia_genero ).fontSize(11).end).width(50).end,
        new Cell (new Txt( 'Existe denuncia: ').bold().fontSize(11).end).width(85).end,
        new Cell (new Txt( existe_denuncia ).fontSize(11).end).width(50).end,
        new Cell (new Txt( 'Existe cautelar: ').bold().fontSize(11).end).width(80).end,
        new Cell (new Txt( existe_cautelar ).fontSize(11).end).width(50).end        
      ]
    });    

    pdf.add(' ');    

    //audiencia
    pdf.add(
      new Txt('Audiencia').bold().fontSize(12).alignment('left').end
    );

    pdf.add(' ');
    
    if(listAudienciasActivas.length > 0){

      pdf.add({
        columns: [
          new Cell (new Txt( 'N° audiencia: ').bold().fontSize(11).end).width(70).end,
          new Cell (new Txt( listAudienciasActivas[0].num_audiencia.toString() ).fontSize(11).end).width(80).end,
          new Cell (new Txt( 'Fecha: ').bold().fontSize(11).end).width(35).end,
          new Cell (new Txt( this.datePipe.transform(listAudienciasActivas[0].fecha_inicio, "dd/MM/yyyy") ).fontSize(11).end).width(80).end,
          new Cell (new Txt( 'Hora: ').bold().fontSize(11).end).width(35).end,
          new Cell (new Txt( listAudienciasActivas[0].hora_inicio.toString() ).fontSize(11).end).width(80).end        
        ]
      });    

      pdf.add(' ');
      
      pdf.add({
        columns: [
          new Cell (new Txt('Centro de mediación: ').bold().fontSize(11).end).width(110).end,
          new Cell (new Txt( listAudienciasActivas[0].centro_mediacion.centro_mediacion ).fontSize(11).end).width(200).end,    
          
        ]
      });    

      pdf.add(' ');
  
      pdf.add({
        columns: [
          new Cell (new Txt('Departamento: ').bold().fontSize(11).end).width(75).end,
          new Cell (new Txt( listAudienciasActivas[0].centro_mediacion.departamento.departamento ).fontSize(11).end).width(170).end,    
          new Cell (new Txt('Municipio: ').bold().fontSize(11).end).width(55).end,
          new Cell (new Txt( listAudienciasActivas[0].centro_mediacion.municipio.municipio ).fontSize(11).end).width(150).end    
        ]
      });  
      pdf.add(' ');
  
      pdf.add({
        columns: [
          new Cell (new Txt('Domicilio: ').bold().fontSize(11).end).width(55).end,
          new Cell (new Txt( 
            'Barrio: ' + listAudienciasActivas[0].centro_mediacion.localidad_barrio +
            ' - Calle/Direccion: ' + listAudienciasActivas[0].centro_mediacion.calle_direccion +
            ' - N°: ' + listAudienciasActivas[0].centro_mediacion.numero_dom 
          
          ).fontSize(11).end).width(400).end    
        ]
      });    
  
      
    }
    else{
      pdf.add(
        new Txt('No tiene una audiencia programada').fontSize(11).alignment('left').end
      );
      pdf.add(' ');
      pdf.add(' ');
      pdf.add(' ');
      pdf.add(' ');
      pdf.add(' ');
      pdf.add(' ');
    }

    pdf.add(' ');
    pdf.add(' ');

    //convocados
    pdf.add(
      new Txt('Convocados').bold().fontSize(12).alignment('left').end
    );
    
    let misConvocados: string[] = [];
    let miConvocado: string;
    dataTramite.convocados.forEach(convocado => {
      miConvocado = "Apellido y nombre: " + convocado.apellido + " " + convocado.nombre;
      misConvocados.push(miConvocado);
    });

    pdf.add(
      {
        ul: misConvocados
      }
    );

    pdf.add(' ');
    pdf.add(' ');


    pdf.add(' ');
     
    pdf.create().open();
                             
  }
}
