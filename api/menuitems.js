const express = require('express');
const menuItemsRouter = express.Router({mergeParams: true});

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

 
menuItemsRouter.param('menuItemId', (req, res, next, menuItemId) => {
  const query = 'SELECT * FROM MenuItem WHERE MenuItem.id = $menuItemId';
  const params = {$menuItemId: menuItemId};
  
  db.get(query, params, (err, menuItem) => {
    if(err) {next(err)}
    else if(menuItem) {
      req.menuItem = menuItem;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});


// GET ALL MENUS
menuItemsRouter.get('/', (req, res, next) => {
  const query = 'SELECT * FROM MenuItem WHERE MenuItem.menu_id = $menuId';
  const params = { $menuId: req.params.menuId};
  
  db.all(query, params, (err,menuItems) => {
    if(err) {next(err);}
    else { res.status(200).json({menuItems: menuItems});}
  });
});

//CREATE MENU ITEM
menuItemsRouter.post('/', (req, res, next) => {
  const name = req.body.menuItem.name;
  const desc = req.body.menuItem.description;
  const inv = req.body.menuItem.inventory;
  const price = req.body.menuItem.price;
  const menuId = req.params.menuId;
  
  if(!name || !desc || !inv || !price || !menuId) {
    res.sendStatus(400);
  }
  
  const query = "INSERT INTO MenuItem (name, description, inventory, price, menu_id) VALUES ($name, $desc, $inv, $price, $menuId)";
  const params = {
    $name: name,
    $desc: desc,
    $inv: inv,
    $price: price,
    $menuId: menuId
  };
  
  db.run(query, params, function(err) {
    if(err) {next(err);}
    else {
      db.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${this.lastID}`, (err, menuItem) => {
        res.status(201).json({menuItem: menuItem});
      });
    }
  });
  
});

menuItemsRouter.put('/:menuItemId', (req, res, next) => {
  const name = req.body.menuItem.name;
  const desc = req.body.menuItem.description;
  const inv = req.body.menuItem.inventory;
  const price = req.body.menutItem.price;
  const menuId = req.params.menuId;
  
  if(!name || !desc || !inv || !price || !menuId) {
    res.sendStatus(400);
  }
  
  const query = 'UPDATE MenuItem SET name = $name, description = $desc, inventory = $inv, price = $price, menu_id = $menuId WHERE MenuItem.id = $menuItemId';
  const params = {
    $name: name,
    $desc: desc,
    $inv: inv,
    $price: price,
    $menuId: menuId,
    $menuItemId: req.params.menuItemId
  };
  
  db.run(query, params, (err) => {
    if(err) {next(err);}
    else {
      db.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${req.params.menuItemId}`, (err, menuItem) => {
        if(err) {next(err);}
        else {res.status(200).json({menuItem: menuItem});}
      });
    }
  });
});

menuItemsRouter.delete('/:menuItemId', (req, res, next) => {
  const menuItemId = req.params.menuItemId;
  
  const query = 'DELETE FROM MenuItem WHERE MenuItem.id = $menuItemId';
  const params = {$menuItemId: menuItemId};
  
  db.run(query, params, (err) => {
    if(err) {next(err);}
    else { res.sendStatus(204);}
  })
})

module.exports = menuItemsRouter;