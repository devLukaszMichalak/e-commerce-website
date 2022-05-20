import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CheckoutFormService } from 'src/app/services/checkout-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private formBuilder: FormBuilder, private checkoutFormService: CheckoutFormService) { }

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];


  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [" "],
        lastName: [" "],
        email: [" "]
      }),
      shippingAdress: this.formBuilder.group({
        street: [" "],
        city: [" "],
        county: [" "],
        state: [" "],
        zipCode: [" "]
      }),
      billingAdress: this.formBuilder.group({
        street: [" "],
        city: [" "],
        county: [" "],
        state: [" "],
        zipCode: [" "]
      }),
      creditCard: this.formBuilder.group({
        cardType: [" "],
        nameOnCard: [" "],
        cardNumber: [" "],
        securityCode: [" "],
        expirationYear: [" "],
        expirationMonth: [" "]
      })
    })

    const startMonth: number = new Date().getMonth() + 1;

    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    )


    this.checkoutFormService.getCreditCardYears().subscribe(
      data => this.creditCardYears = data
    )

  }

  onSubmit() {
    console.log("Handling the submition");

  }

  copyShippingAdressToBillingAdress(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAdress'].setValue(this.checkoutFormGroup.controls['shippingAdress'].value);

    } else {
      this.checkoutFormGroup.controls['billingAdress'].reset();
    }

  }

}
