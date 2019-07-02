when product is created

// - push to bap the product as entity


## when order is invoiced

- products are pushed into bap as line item

```JS
{
  amount: 10,
  units: 5,
  entity: {
      id: 'system-id',
      name: 'crocin',
      type: {
          name: 'medicines',
          category: 'essential-medicine' // tax would be calculated on this
      }
  }
}
```

```JS
{
  order: {
    id: '2323232',
    code: '23232323',
      service: {
        code: 'inv'
      }
  },

}

```

response

- stock is reduced 


