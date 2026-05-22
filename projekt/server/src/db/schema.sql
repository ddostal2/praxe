create table products (
    id int auto increment primary key,
    name varchar(20) not null,
    category_id int constraint product_category_fk foreign key (product_category_fk) references categories(id),
    price int not null
);

create table categories (
    id int auto increment primary key,
    name varchar(20) not null
);

create table orders (
    id int auto increment primary key,
    customers_name varchar(20) not null,
    customers_surname varchar(25) not null,
    customers_email varchar(40) not null
);

create table order_items (
    id int auto increment primary key,
    order_id int constraint items_order_fk foreign key (items_order_fk) references orders(id),
    product_id int constraint items_product_fk foreign key (items_product_fk) references products(id)
);

create table contact_messages (

);