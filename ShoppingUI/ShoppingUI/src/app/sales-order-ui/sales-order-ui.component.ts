import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PROXY_SERVER } from '../app.component';
import { Customer, CUSTOMER_SERVICE } from '../customer-ui/customer-ui.component';
import { Item, ITEM_SERVICE } from '../item-ui/item-ui.component';

export class SalesOrder {
  id?: number;
  orderDate?: Date = new Date();
  orderDesc?: string;
  totalPrice?: number;
  orderLineItems: OrderLineItem[] = [];
  custId: number;
}

export class OrderLineItem {
  id?: number;
  itemName?: string;
  itemQuantity?: number;
}

export const SALESORDER_SERVICE: string = PROXY_SERVER + "/salesApi/orders/";

@Component({
  selector: 'app-sales-order-ui',
  templateUrl: './sales-order-ui.component.html',
  styleUrls: ['./sales-order-ui.component.css']
})
export class SalesOrderUIComponent implements OnInit {

  displayedColumns: any[] = [
    { field: 'id', header: 'Order Id' },
    { field: 'orderDesc', header: 'Description' },
    { field: 'custId', header: 'Customer Id' },
    { field: 'count', header: 'Count of Items' }];
  orders = [];
  displayDialog: boolean = false;

  // Variables for Modal window
  customerList: Customer[];
  orderLineItem: OrderLineItem = new OrderLineItem();
  itemList: Item[];
  data: SalesOrder = new SalesOrder();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.retrieveSalesOrders();
    this.http.get<Customer[]>(CUSTOMER_SERVICE).subscribe(
      (data) => {
        console.log(data);
        this.customerList = data;
      },
      (error) => {
        console.log(error);
      }
    );
    this.http.get<Item[]>(ITEM_SERVICE).subscribe(
      (data) => {
        console.log(data);
        this.itemList = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  retrieveSalesOrders() {
    this.http.get<SalesOrder[]>(SALESORDER_SERVICE).subscribe(
      (data) => {
        console.log(data);
        this.orders = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  openDialog(): void {
    this.displayDialog = true;
  }
  onNoClick(): void {
    this.displayDialog = false;
  }
  onAddItemClick(): void {
    console.log(this.orderLineItem);
    this.data.orderLineItems.push(this.orderLineItem);
    this.orderLineItem = new OrderLineItem();
  }
  onOkClick(): void {
    this.data.id = 0;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    console.log(this.data);
    this.http.post(SALESORDER_SERVICE, JSON.stringify(this.data), httpOptions).subscribe(
      (data) => {
        console.log(data);
        this.data = new SalesOrder();
        this.displayDialog = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
