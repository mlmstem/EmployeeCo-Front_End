import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxPayPalModule, IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [CommonModule, NgxPayPalModule],
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {
  isYearly = false;

  public payPalConfigBasic?: IPayPalConfig;
  public payPalConfigPlus?: IPayPalConfig;
  public payPalConfigPro?: IPayPalConfig;


  showBasicCard = false;
  showPlusCard = false;
  showProCard = false;

  ngOnInit(): void {
    setTimeout(() => {
      this.showBasicCard = true;
      this.initBasicConfig();
    }, 1100); // Add a small delay before initializing
    setTimeout(() => {
      this.showPlusCard = true;
      this.initPlusConfig();
    }, 700); // Slightly delay each configuration
    setTimeout(() => {
      this.showProCard = true;
      this.initProConfig();
    }, 900);
  }

  setPricing(yearly: boolean) {
    this.isYearly = yearly;
    this.initBasicConfig();
    this.initPlusConfig();
    this.initProConfig();
  }

  private initBasicConfig(): void {
    const price = this.isYearly ? '50' : '6';
    this.payPalConfigBasic = {
      currency: 'USD',
      clientId: 'YAS4fQNfBmOrpDh4MkQsFRx2Y8vrpatG6sf3IM5gTjcsoSAAhIyL92jIhOS_shR5QE95NjHJuPBqjSg1Q',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: price,
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: price
              }
            }
          },
          items: [{
            name: this.isYearly ? 'Basic Yearly Subscription' : 'Basic Monthly Subscription',
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: 'USD',
              value: price,
            },
          }]
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('Transaction approved, but not authorized yet', data, actions);
        actions.order.get().then((details: any) => {
          console.log('Order details:', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('Transaction completed successfully', data);
        // Here you can handle the successful transaction
      },
      onCancel: (data, actions) => {
        console.log('Transaction cancelled', data, actions);
      },
      onError: err => {
        console.log('Error during transaction', err);
      },
      onClick: (data, actions) => {
        console.log('PayPal button clicked', data, actions);
      },
    };
  }

  private initPlusConfig(): void {
    const price = this.isYearly ? '99' : '19';
    this.payPalConfigPlus = {
      currency: 'USD',
      clientId: 'AS4fQNfBmOrpDh4MkQsFRx2Y8vrpatG6sf3IM5gTjcsoSAAhIyL92jIhOS_shR5QE95NjHJuPBqjSg1Q',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: price,
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: price
              }
            }
          },
          items: [{
            name: this.isYearly ? 'Plus Yearly Subscription' : 'Plus Monthly Subscription',
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: 'USD',
              value: price,
            },
          }]
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('Transaction approved, but not authorized yet', data, actions);
        actions.order.get().then((details: any) => {
          console.log('Order details:', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('Transaction completed successfully', data);
        // Here you can handle the successful transaction
      },
      onCancel: (data, actions) => {
        console.log('Transaction cancelled', data, actions);
      },
      onError: err => {
        console.log('Error during transaction', err);
      },
      onClick: (data, actions) => {
        console.log('PayPal button clicked', data, actions);
      },
    };
  }

  private initProConfig(): void {
    const price = this.isYearly ? '199' : '39';
    this.payPalConfigPro = {
      currency: 'USD',
      clientId: 'AS4fQNfBmOrpDh4MkQsFRx2Y8vrpatG6sf3IM5gTjcsoSAAhIyL92jIhOS_shR5QE95NjHJuPBqjSg1Q',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: price,
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: price
              }
            }
          },
          items: [{
            name: this.isYearly ? 'Pro Yearly Subscription' : 'Pro Monthly Subscription',
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: 'USD',
              value: price,
            },
          }]
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('Transaction approved, but not authorized yet', data, actions);
        actions.order.get().then((details: any) => {
          console.log('Order details:', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('Transaction completed successfully', data);
        // Here you can handle the successful transaction
      },
      onCancel: (data, actions) => {
        console.log('Transaction cancelled', data, actions);
      },
      onError: err => {
        console.log('Error during transaction', err);
      },
      onClick: (data, actions) => {
        console.log('PayPal button clicked', data, actions);
      },
    };
  }
}


