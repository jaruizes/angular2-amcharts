import {Injectable} from '@angular/core';

@Injectable()
export class FundsService {

  constructor() {
  }

  getSimulationFunds(): Object[] {
    /*alias required string
    area required string
    descripcion required string
    divisa required string
    nombre required string
    porcentajeParticipacion required number
    tipo required, one of (F, V, O) string*/

    let apiResponse:Object[] = [
      {
        'nombre':'RENTA FIJA MONETARIOS',
        'porcentajeParticipacion':10,
        'tipo':'F',
      },
      {
        'nombre':'RENTA FIJA CORTO PLAZO',
        'porcentajeParticipacion':10,
        'tipo':'F',
      },
      {
        'nombre':'RENTA FIJA LARGO PLAZO',
        'porcentajeParticipacion':30,
        'tipo':'F',
      },
      {
        'nombre':'RENTA FIJA FLEXIBLE',
        'porcentajeParticipacion':10,
        'tipo':'F',
      },
      {
        'nombre':'RENTA VARIABLE A',
        'porcentajeParticipacion':20,
        'tipo':'V',
      },
      {
        'nombre':'RENTA VARIABLE B',
        'porcentajeParticipacion':10,
        'tipo':'V',
      },
      {
        'nombre':'MIXTO A',
        'porcentajeParticipacion':5,
        'tipo':'O',
      },
      {
        'nombre':'INMOBILIARIO ESPECIAL',
        'porcentajeParticipacion':2.5,
        'tipo':'O',
      },
      {
        'nombre':'GARANTIZADO BKT',
        'porcentajeParticipacion':2.5,
        'tipo':'O',
      },
    ];

    return apiResponse;
  }

  getProfitability(): Object[] {
    let dates:Date[] = [];
    for (let _i = 0; _i < 10; _i++) {
      dates.push(new Date(2007 + _i,11,31));
    }

    let apiResponse:Object = dates.reduce(function (previousValue, currentValue) {
      let values:Object[] = previousValue['values'];
      values.push(FundsService.buildSimpleValue(currentValue, 'Tu cartera'));
      values.push(FundsService.buildSimpleValue(currentValue, 'IBEX'));
      values.push(FundsService.buildSimpleValue(currentValue, 'EUROSTOXX 50'));
      values.push(FundsService.buildSimpleValue(currentValue, 'S&P 500'));
      values.push(FundsService.buildSimpleValue(currentValue, 'Nikkei 225'));
      values.push(FundsService.buildSimpleValue(currentValue, 'MSCI World'));

      return {
        'values' : values
      }

    },{ 'values': []});


    console.log(apiResponse);

    return apiResponse['values'];
  }

  static getRandomArbitrary(): string {
    let min: number = -5;
    let max: number = 10;
    return (Math.random() * (max - min) + min).toFixed(2);
  }

  static buildSimpleValue(date, name) {
    return {
      'fecha': date,
      'nombre': name,
      'tipo': name == 'Tu cartera' ? 'C' : 'I',
      'valor': FundsService.getRandomArbitrary()
    }
  }
}

