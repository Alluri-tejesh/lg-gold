# The admin page

Open the website address followed by `#admin`, for example `https://lggoldrice.com/#admin`. It works on a phone too.

## Signing in

Use the username and password from the server settings (`server/.env`):

```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-password-here
```

To change the password, edit `ADMIN_PASSWORD` (10 characters or more) and restart the server. You stay signed in for 12 hours on a device. After 10 wrong tries, sign-in pauses for 15 minutes.

## Orders

New orders appear the moment a customer places them. Tap a card at the top (To confirm, To pack, On the way) to filter.

Open an order to:

- call or WhatsApp the customer;
- move it along: Confirmed → Being packed → On the way → Delivered (or Cancelled before packing);
- add a message the customer sees in their order timeline, and a lorry or tracking reference;
- record payment: tick “I checked the money arrived” and enter the UPI reference (UTR) or cash receipt number. UPI orders must be marked paid before they can be dispatched.

## Products & prices

Every product and pack with its price, MRP and stock switch. Change what you need, then press **Save changes** at the bottom. Customers see the new prices on their next page load; the price date on the site becomes today.

- **Add a pack size** (5kg, 10kg, 50kg…) from the product's pack list.
- **Change a photo** by tapping the picture. Phone photos are shrunk automatically before upload.
- **Out of stock**: switch off a single pack or the whole product.

## Add a product

Name, photo, first pack size and price. It appears in the products list; press **Save changes** to put it on the website.

## Customers

Find a customer by name, mobile or email. If someone forgot their password, press **Reset password**: you get a temporary password and a button to send it to them on WhatsApp. They sign in with it and change it under Account › Security.

## Settings

- Free delivery threshold and the delivery charge below it.
- The UPI ID that receives payments, and the name shown in the UPI app.
- Cash on delivery on or off.
- SMS code sign-in on or off (off by default: customers use their password). It only works once an SMS provider (Twilio) is set up in the server settings; the page tells you if one is connected.

Saved with the same **Save changes** button; new orders use them immediately.
