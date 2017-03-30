import {Component} from '@angular/core';
import {FundsService} from "./services/funds.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  lineChartData: Object[];
  donutChartData: Object[];
  idDonut: string;
  idLine: string;
  customerInvestmentPortfolio: string;

  constructor(private fundsService: FundsService) {
    this.adaptSimulationDataFromAPI();
    this.adaptProfitabilityDataFromAPI();
    //this.lineChartData = fundsService.getProfitability();
    this.idDonut = 'chart001';
    this.idLine = 'chart002';
    this.customerInvestmentPortfolio = 'Tu cartera';
  }

  rollOverSlice(e) {
    console.log('rollOverSlice recived!!!!');
    console.log(e);
  }

  /**
   * Adapts data received from API to the right format to the donut chart component
   */
  adaptSimulationDataFromAPI() {
    let dataAPI:Object[] = this.fundsService.getSimulationFunds();
    let fixedRent: Object = {
      'category': 'RENTA FIJA',
      'total': 0,
      'description': 'Se trata de fondos de inversión que invierten, exclusivamente, en activos financieros de deuda a corto, medio y largo plazo, emitidos por el Estado o por empresas o entidades publicas y privadas tales como Letras del tesoro, Pagares empresariales, Bonos y Obligaciones, etc.',
      'composition': []
    };
    let variableRent: Object = {
      'category': 'RENTA VARIABLE',
      'total': 0,
      'description': 'Se trata de fondos de inversión que invierten en una combinación de activos de renta variable y en activos de renta fija. Según sea la mayor o menor proporción de inversión en renta variable o de renta fija determina si el fondo es de renta variable mixta o es de renta fija mixta, respectivamente.',
      'composition': []
    };
    let others: Object = {
      'category': 'OTROS',
      'total': 0,
      'composition': []
    };

    let fixedRentUpdated: Object = dataAPI.filter(function (item) {return item['tipo'] == 'F';}).reduce(AppComponent.simulationReducer, fixedRent);
    let variableRentUpdated: Object = dataAPI.filter(function (item) {return item['tipo'] == 'V';}).reduce(AppComponent.simulationReducer, variableRent);
    let othersUpdated: Object = dataAPI.filter(function (item) {return item['tipo'] == 'O';}).reduce(AppComponent.simulationReducer, others);
    this.donutChartData = [fixedRentUpdated, variableRentUpdated, othersUpdated];
  }

  /**
   * Adapts data received from API to the right format to the line chart component
   */
  adaptProfitabilityDataFromAPI() {
    let dataAPI:Object[] = this.fundsService.getProfitability();
    this.lineChartData = dataAPI.reduce(AppComponent.profitabilityReducer, { 'profitability': []})['profitability'];

    console.log(this.lineChartData);
  }

  /**
   * Reducer for adapting simulation data received from the API to the data needed for the donut chart component
   * @param previousValue
   * @param currentValue
   * @returns {{category: any, total: any, description: any, composition: Object[]}}
   */
  static simulationReducer(previousValue, currentValue) {
    let composition: Object[] = previousValue['composition'];
    composition.push({'name': currentValue['nombre'], 'value': currentValue['porcentajeParticipacion']});

    return {
      'category': previousValue['category'],
      'total': previousValue['total'] + currentValue['porcentajeParticipacion'],
      'description': previousValue['description'],
      'composition': composition
    };
  }

  /**
   * Reducer for adapting simulation data received from the API to the data needed for the line chart component
   * @param previousValue
   * @param currentValue
   * @returns {any}
   */
  static profitabilityReducer (previousValue, currentValue) {
    let currentDate:string = AppComponent.formatDate(currentValue['fecha']);
    let profitability:Object[] = previousValue['profitability'];

    // Search for the object with date equals to currentValue.date. Filter method must return an array with one element
    // or empty if it doesn't exist yet
    let index:number = -1;
    let dateObjectArray:Object[] = profitability.filter(function(item, itemIndex) {
      if (item['date'] == currentDate) {
        index = itemIndex;
        return true;
      }
      return false;
    });

    // If it doesn't exit yet, a new item with the current date is created and pushed into the profitability array
    let item:Object = dateObjectArray[0];
    if (index < 0) {
      item = { 'date': currentDate };
      profitability.push(item);
    }

    // In both cases, we set the new profitability record associated to the current date
    item[currentValue['nombre']] = currentValue['valor'];
    previousValue['profitability'] = profitability;

    return previousValue;

  }

  static formatDate(date) {
    let monthNames = [
      'ENE', 'FEB', 'MAR',
      'ABR', 'MAY', 'JUN', 'JUL',
      'AGO', 'SEP', 'OCT',
      'NOV', 'DIC'
    ];

    let year = date.getFullYear().toString().substr(-2);

    return monthNames[date.getMonth()] + '-' + year;
  }
}
