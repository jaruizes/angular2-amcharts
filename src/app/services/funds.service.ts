import { Injectable } from '@angular/core';

@Injectable()
export class FundsService {

    constructor() { }

    getSimulationFunds():Object[] {
      return [
        {
          "category": "category 1",
          "column-1": 8,
          "column-2": [
            { "name": "RENTA FIJA MONETARIOS", "value": "10%" },
            { "name": "RENTA FIJA CORTO PLAZO", "value": "10%" },
            { "name": "RENTA FIJA LARGO PLAZO", "value": "30%" },
            { "name": "RENTA FIJA FLEXIBLE", "value": "10%" },
          ]
        },
        {
          "category": "category 2",
          "column-1": 6,
          "column-2": [
            { "name": "RENTA FIJA MONETARIOS", "value": "30%" },
            { "name": "RENTA FIJA CORTO PLAZO", "value": "10%" },
            { "name": "RENTA FIJA LARGO PLAZO", "value": "30%" },
            { "name": "RENTA FIJA FLEXIBLE", "value": "10%" },
          ]
        },
        {
          "category": "category 3",
          "column-1": 2,
          "column-2": [
            { "name": "RENTA FIJA MONETARIOS", "value": "40%" },
            { "name": "RENTA FIJA CORTO PLAZO", "value": "10%" },
            { "name": "RENTA FIJA LARGO PLAZO", "value": "30%" },
            { "name": "RENTA FIJA FLEXIBLE", "value": "10%" },
          ]
        }
      ];
    }

}
