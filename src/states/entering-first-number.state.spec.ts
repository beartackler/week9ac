
import { NumericKeys, OperatorKeys } from '../enums';
import { ICalculatorState, IContext, IStateData } from '../interfaces';
import { CalculatorModel } from '../models/calculator.model';
import { StateData } from '../models/state-data.model';
import { EnteringFirstNumberState } from './entering-first-number.state';

describe('states', (): void => {
  describe('EnteringFirstNumberState', (): void => {

    let enteringFirstNumberState: EnteringFirstNumberState;
    let calculatorModel: IContext;
    let stateData: IStateData;

    beforeEach((): void => {
      calculatorModel = new CalculatorModel();
      stateData = new StateData.Builder().build();
      enteringFirstNumberState = new EnteringFirstNumberState(calculatorModel, stateData);
    });

    afterEach((): void => {
      jest.clearAllMocks();
      enteringFirstNumberState = null as any;
      calculatorModel = null as any;
      stateData = null as any;
    });

    describe('digit()', (): void => {

      it('should replace firstBuffer with input if firstBuffer is 0', (): void => {

        enteringFirstNumberState.data.firstBuffer = '0';

        enteringFirstNumberState.digit(NumericKeys.ONE);

        expect(enteringFirstNumberState.data.firstBuffer).toEqual('1');

      });

      it('should append the input digit to the firstBuffer if firstBuffer is not 0', (): void => {

        enteringFirstNumberState.digit(NumericKeys.ONE);

        expect(enteringFirstNumberState.data.firstBuffer).toEqual('1');

      });

    });

    describe('decimalSeparator()', (): void => {

      it('should add a decimal point to firstBuffer if the buffer is currently empty', (): void => {

        enteringFirstNumberState.decimalSeparator();

        expect(enteringFirstNumberState.data.firstBuffer).toEqual('.');

      });

      it('should add a decimal point at the end of firstBuffer if the buffer is not empty', (): void => {

        enteringFirstNumberState.data.firstBuffer = '12';

        enteringFirstNumberState.decimalSeparator();

        expect(enteringFirstNumberState.data.firstBuffer).toEqual('12.');

      });

      it('should do nothing if firstBuffer already contains a decinal point', (): void => {

        enteringFirstNumberState.data.firstBuffer = '12.34';

        enteringFirstNumberState.decimalSeparator();

        expect(enteringFirstNumberState.data.firstBuffer).toEqual('12.34');

      });

    });

    describe('binaryOperator()', (): void => {

      it('should transition to EnteringSecondNumberState by invoking context.changeState', (): void => {

        enteringFirstNumberState.data.firstBuffer = '1';
        jest.spyOn(calculatorModel, 'changeState').mockReturnValue(null as any);
        const mockData: IStateData = new StateData.Builder().withFirstBuffer('1').withFirstOperator(OperatorKeys.PLUS).build();

        enteringFirstNumberState.binaryOperator(OperatorKeys.PLUS);

        expect(calculatorModel.changeState).toHaveBeenCalledWith(new EnteringFirstNumberState(calculatorModel, mockData));

      });

      it('should change firstBuffer to 0 before transitioning if it is empty', (): void => {

        jest.spyOn(calculatorModel, 'changeState').mockReturnValue(null as any);
        const mockData: IStateData = new StateData.Builder().withFirstBuffer('0').withFirstOperator(OperatorKeys.PLUS).build();

        enteringFirstNumberState.binaryOperator(OperatorKeys.PLUS);

        expect(calculatorModel.changeState).toHaveBeenCalledWith(new EnteringFirstNumberState(calculatorModel, mockData));

      });

    });

    describe('equals()', (): void => {

      it('should stay in/transition to the same state', (): void => {

        jest.spyOn(calculatorModel, 'changeState').mockReturnValue(null as any);

        enteringFirstNumberState.equals();

        expect(calculatorModel.changeState).toHaveBeenCalledWith(enteringFirstNumberState);

      });

    });

    describe('clear()', (): void => {

      it('should transition to EnteringFirstNumberState with empty state', (): void => {

        const expectedState: ICalculatorState = new EnteringFirstNumberState(calculatorModel, new StateData.Builder().build());
        jest.spyOn(calculatorModel, 'changeState').mockReturnValue(null as any);

        enteringFirstNumberState.clear();

        expect(calculatorModel.changeState)
          .toHaveBeenCalledWith(expectedState);

      });

    });

    describe('display()', (): void => {

      it('should call through to state.display()', (): void => {

        jest.spyOn(stateData, 'display').mockReturnValue('displayValue');

        enteringFirstNumberState.display();

        expect(stateData.display).toHaveBeenCalledWith();

      });

      it('should call return the value returned by state.display()', (): void => {

        jest.spyOn(stateData, 'display').mockReturnValue('displayValue');

        const returnedValue: string = enteringFirstNumberState.display();

        expect(returnedValue).toEqual('displayValue');

      });

    });

  });
});
