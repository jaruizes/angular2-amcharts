import { Injectable } from '@angular/core';

@Injectable()
export class FundsService {

    constructor() { }

    getSimulationFunds():Object[] {
      return [
        {
          "category": "RENTA FIJA",
          "total": 60,
          "composition": [
            { "name": "RENTA FIJA MONETARIOS", "value": "10%" },
            { "name": "RENTA FIJA CORTO PLAZO", "value": "10%" },
            { "name": "RENTA FIJA LARGO PLAZO", "value": "30%" },
            { "name": "RENTA FIJA FLEXIBLE", "value": "10%" },
          ]
        },
        {
          "category": "RENTA VARIABLE",
          "total": 30,
          "composition": [
            { "name": "RENTA VARIABLE A", "value": "20%" },
            { "name": "RENTA VARIABLE B", "value": "10%" },
          ]
        },
        {
          "category": "OTROS",
          "total": 10,
          "composition": [
            { "name": "MIXTO A", "value": "5%" },
            { "name": "INMOBILIARIO ESPECIAL", "value": "2.5%" },
            { "name": "GARANTIZADO BKT", "value": "2.5%" }
          ]
        }
      ];
    }

}
