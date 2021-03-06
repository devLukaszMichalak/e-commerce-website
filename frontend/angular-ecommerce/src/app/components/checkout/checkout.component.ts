import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutFormService } from 'src/app/services/checkout-form.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { CheckoutFormValidators } from 'src/app/validators/checkout-form-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  

  constructor(private formBuilder: FormBuilder, private checkoutFormService: CheckoutFormService,
              private cartServicee: CartService, private checkoutService: CheckoutService, private router: Router) { }

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAdressStates: State[] = [];
  billingAdressStates: State[] = [];


  ngOnInit(): void {

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',[Validators.required, Validators.minLength(2), CheckoutFormValidators.notOnlyWhiteSpaces]),
        lastName: new FormControl('',[Validators.required, Validators.minLength(2), CheckoutFormValidators.notOnlyWhiteSpaces]),
        email: new FormControl('',[Validators.required, Validators.pattern(
          '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,7}$'
        )])
      }),
      shippingAdress: this.formBuilder.group({
        street: new FormControl('',[Validators.required, Validators.minLength(2), CheckoutFormValidators.notOnlyWhiteSpaces]),
        city: new FormControl('',[Validators.required, Validators.minLength(2), CheckoutFormValidators.notOnlyWhiteSpaces]),
        country: new FormControl('',Validators.required),
        state: new FormControl('',Validators.required),
        zipCode: new FormControl('',[Validators.required, Validators.minLength(2), CheckoutFormValidators.notOnlyWhiteSpaces])
      }),
      billingAdress: this.formBuilder.group({
        street: new FormControl('',[Validators.required, Validators.minLength(2), CheckoutFormValidators.notOnlyWhiteSpaces]),
        city: new FormControl('',[Validators.required, Validators.minLength(2), CheckoutFormValidators.notOnlyWhiteSpaces]),
        country: new FormControl('',Validators.required),
        state: new FormControl('',Validators.required),
        zipCode: new FormControl('',[Validators.required, Validators.minLength(2), CheckoutFormValidators.notOnlyWhiteSpaces])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('',Validators.required),
        nameOnCard: new FormControl('',[Validators.required, Validators.minLength(2), CheckoutFormValidators.notOnlyWhiteSpaces]),
        cardNumber: new FormControl('',[Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('',[Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationYear: new FormControl('',Validators.required),
        expirationMonth: new FormControl('',Validators.required)
      })
    })

    const startMonth: number = new Date().getMonth() + 1;

    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    )


    this.checkoutFormService.getCreditCardYears().subscribe(
      data => this.creditCardYears = data
    )

    //populate countries
    this.checkoutFormService.getCounntries().subscribe(
      data => this.countries = data
    )

  }
  reviewCartDetails() {
    this.cartServicee.totalQuantity.subscribe(
      data => this.totalQuantity = data
    )

    this.cartServicee.totalPrice.subscribe(
      data => this.totalPrice = data
    )
    
  }

  onSubmit() {
    console.log("Handling the submition");
    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    let order = new Order();
    order.totalQuantity = this.totalQuantity;
    order.totalPrice = this.totalPrice;

    const cartItems = this.cartServicee.cartItems;

    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    let purchase = new Purchase();

    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAdress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAdress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    purchase.order = order;
    purchase.orderItems = orderItems;

    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response => {
          alert(`Success! Your order tracking number is: ${response.orderTrackingNumber}`);
          this.resetCart();
        },

        error: err => {
          alert(`There was an error: ${err.message}`);
        }

      }
    );
  }

  resetCart() {
    this.cartServicee.cartItems = [];
    this.cartServicee.totalPrice.next(0);
    this.cartServicee.totalQuantity.next(0);

    this.checkoutFormGroup.reset();

    this.router.navigateByUrl("/products");

  }

  get firstName(){return this.checkoutFormGroup.get('customer.firstName');}
  get lastName(){return this.checkoutFormGroup.get('customer.lastName');}
  get email(){return this.checkoutFormGroup.get('customer.email');}

  get shippingAdressStreet(){return this.checkoutFormGroup.get('shippingAdress.street');}
  get shippingAdressCity(){return this.checkoutFormGroup.get('shippingAdress.city');}
  get shippingAdressCountry(){return this.checkoutFormGroup.get('shippingAdress.country');}
  get shippingAdressState(){return this.checkoutFormGroup.get('shippingAdress.state');}
  get shippingAdressZipCode(){return this.checkoutFormGroup.get('shippingAdress.zipCode');}

  get billingAdressStreet(){return this.checkoutFormGroup.get('billingAdress.street');}
  get billingAdressCity(){return this.checkoutFormGroup.get('billingAdress.city');}
  get billingAdressCountry(){return this.checkoutFormGroup.get('billingAdress.country');}
  get billingAdressState(){return this.checkoutFormGroup.get('billingAdress.state');}
  get billingAdressZipCode(){return this.checkoutFormGroup.get('billingAdress.zipCode');}

  get creditCardType(){return this.checkoutFormGroup.get('creditCard.cardType');}
  get creditCardNameOnCard(){return this.checkoutFormGroup.get('creditCard.nameOnCard');}
  get creditCardNumber(){return this.checkoutFormGroup.get('creditCard.cardNumber');}
  get creditCardSecurityCode(){return this.checkoutFormGroup.get('creditCard.securityCode');}
  get creditCardExpirationYear(){return this.checkoutFormGroup.get('creditCard.expirationYear');}
  get creditCardExpirationMonth(){return this.checkoutFormGroup.get('creditCard.expirationMonth');}



  

  copyShippingAdressToBillingAdress(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAdress'].setValue(this.checkoutFormGroup.controls['shippingAdress'].value);
      //to populate states when copying
      this.billingAdressStates = this.shippingAdressStates;

    } else {
      this.checkoutFormGroup.controls['billingAdress'].reset();
      this.billingAdressStates = [];

    }

  }

  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }

    );
  }

  getStates(formGroupName: string) {
    const FormGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = FormGroup.value.country.code;
    const countryName = FormGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.checkoutFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAdress') {
          this.shippingAdressStates = data;
        }
        else {
          this.billingAdressStates = data;
        }
        FormGroup.get('state').setValue(data[0]);
      }
    )
  }

}
