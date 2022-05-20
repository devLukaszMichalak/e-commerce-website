import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  currentCategoryId: number = 1;
  perviousCategoryId: number = 1;
  searchMode: boolean = false;

  //pagination properties
  thePageNumber: number = 1;
  thePageSize: number = 8;
  theTotalElements: number = 0;

  perviousKeyword: string = null;


  constructor(private productService: ProductService,
    private activatedRoute: ActivatedRoute, private cartService: CartService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(
      () => { this.listProducts() }
    );

  }

  listProducts() {

    this.searchMode = this.activatedRoute.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }

  }

  handleListProducts() {
    const hasCategoryId: boolean = this.activatedRoute.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      this.currentCategoryId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'));

    }
    else {
      this.currentCategoryId = 1;
    }


    if (this.perviousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.perviousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

    this.productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId)
      .subscribe(this.processResult());

  }

  processResult() {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  handleSearchProducts() {
    const theKeyword: string = this.activatedRoute.snapshot.paramMap.get('keyword');

    if(this.perviousKeyword != theKeyword){
      this.thePageNumber = 1;
    }
    this.perviousKeyword =theKeyword;
    console.log(`perviousKeyword=${theKeyword}, thePageNumber=${this.thePageNumber}`)

    this.productService.searchProductsPaginate(this.thePageNumber - 1, this.thePageSize,
      theKeyword).subscribe(this.processResult());
    
  }

  updatePageSize(page: number) {
    this.thePageSize = page;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(product: Product){
    //logs for adding
    console.log("Adding to cart:");
    console.log(product.name);
    console.log(product.unitPrice);

    const theCartItem: CartItem = new CartItem(product);

    this.cartService.addToCart(theCartItem);



  }
}
