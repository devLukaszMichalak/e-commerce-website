import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  currentCategoryId: number;
  searchMode: boolean;

  constructor(private productService: ProductService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(
      () => {this.listProducts()}
    );

  }

  listProducts(){

    this.searchMode=this.activatedRoute.snapshot.paramMap.has('keyword');
    if(this.searchMode){
      this.handleSearchProducts();
    }else{
      this.handleListProducts();
    }
    
  }

  handleListProducts(){
    const hasCategoryId: boolean = this.activatedRoute.snapshot.paramMap.has('id');
    if(hasCategoryId){
      this.currentCategoryId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'));
  
    }
    else{
      this.currentCategoryId = 1;
    }
  
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {this.products = data}
    )
  }

  handleSearchProducts() {
    const theKeyword: string  = this.activatedRoute.snapshot.paramMap.get('keyword');

    this.productService.searchProducts(theKeyword).subscribe(
      data => { this.products = data}
    )



  }
}
