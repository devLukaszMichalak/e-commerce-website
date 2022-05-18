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

  constructor(private productService: ProductService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(
      () => {this.listProducts()}
    );

  }

  listProducts(){

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
}
