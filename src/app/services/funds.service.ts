import {Injectable} from '@angular/core';

@Injectable()
export class FundsService {

  constructor() {
  }

  getSimulationFunds(): Object[] {
    return [
      {
        'category': 'RENTA FIJA',
        'total': 60,
        'description': 'Se trata de fondos de inversión que invierten, exclusivamente, en activos financieros de deuda a corto, medio y largo plazo, emitidos por el Estado o por empresas o entidades publicas y privadas tales como Letras del tesoro, Pagares empresariales, Bonos y Obligaciones, etc.',
        'composition': [
          {'name': 'RENTA FIJA MONETARIOS', 'value': '10%'},
          {'name': 'RENTA FIJA CORTO PLAZO', 'value': '10%'},
          {'name': 'RENTA FIJA LARGO PLAZO', 'value': '30%'},
          {'name': 'RENTA FIJA FLEXIBLE', 'value': '10%'},
        ]
      },
      {
        'category': 'RENTA VARIABLE',
        'total': 30,
        'description': 'Se trata de fondos de inversión que invierten en una combinación de activos de renta variable y en activos de renta fija. Según sea la mayor o menor proporción de inversión en renta variable o de renta fija determina si el fondo es de renta variable mixta o es de renta fija mixta, respectivamente.',
        'composition': [
          {'name': 'RENTA VARIABLE A', 'value': '20%'},
          {'name': 'RENTA VARIABLE B', 'value': '10%'},
        ]
      },
      {
        'category': 'OTROS',
        'total': 10,
        'composition': [
          {'name': 'MIXTO A', 'value': '5%'},
          {'name': 'INMOBILIARIO ESPECIAL', 'value': '2.5%'},
          {'name': 'GARANTIZADO BKT', 'value': '2.5%'}
        ]
      }
    ];
  }

  getProfitability(): Object[] {
    let res: Object[] = [];
    for (let _i = 0; _i < 10; _i++) {
      let month: number = 7 + _i;
      let date: string = month <= 9 ? '12/200' + month : '12/20' + month;

      let item: Object = {
        'date': date,
        'Tu cartera': FundsService.getRandomArbitrary(),
        'IBEX': FundsService.getRandomArbitrary(),
        'EUROSTOXX 50': FundsService.getRandomArbitrary(),
        'S&P 500': FundsService.getRandomArbitrary(),
        'Nikkei 225': FundsService.getRandomArbitrary(),
        'MSCI World': FundsService.getRandomArbitrary()
      };

      res.push(item);
    }

    return res;
  }

  static getRandomArbitrary(): string {
    let min: number = -5;
    let max: number = 10;
    return (Math.random() * (max - min) + min).toFixed(2);
  }

}
