/*
 * Copyright 2020 Stripe, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export const creatingCustomer = (uid) => {
    console.log(`⚙️ Creating customer object for [${uid}].`);
  };
  
  export const customerCreationError = (error, uid) => {
    console.error(
      `❗️[Error]: Failed to create customer for [${uid}]:`,
      error.message
    );
  };
  
  export const customerDeletionError = (error, uid) => {
    console.error(
      `❗️[Error]: Failed to delete customer for [${uid}]:`,
      error.message
    );
  };
  
  export function customerCreated(id, livemode) {
    console.log(
      `✅Created a new customer: https://dashboard.stripe.com${
        livemode ? '' : '/test'
      }/customers/${id}.`
    );
  }
  
  export function customerDeleted(id) {
    console.log(`🗑Deleted Stripe customer [${id}]`);
  }
  
  export function creatingCheckoutSession(docId) {
    console.log(`⚙️ Creating checkout session for doc [${docId}].`);
  }
  
  export function checkoutSessionCreated(docId) {
    console.log(`✅Checkout session created for doc [${docId}].`);
  }
  
  export function checkoutSessionCreationError(docId, error) {
    console.error(
      `❗️[Error]: Checkout session creation failed for doc [${docId}]:`,
      error.message
    );
  }
  
  export function createdBillingPortalLink(uid) {
    console.log(`✅Created billing portal link for user [${uid}].`);
  }
  
  export function billingPortalLinkCreationError(uid, error) {
    console.error(
      `❗️[Error]: Customer portal link creation failed for user [${uid}]:`,
      error.message
    );
  }
  
  export function firestoreDocCreated(collection, docId) {
    console.log(
      `🔥📄 Added doc [${docId}] to collection [${collection}] in Firestore.`
    );
  }
  
  export function firestoreDocDeleted(collection, docId) {
    console.log(
      `🗑🔥📄 Deleted doc [${docId}] from collection [${collection}] in Firestore.`
    );
  }
  
  export function userCustomClaimSet(
    uid,
    claimKey,
    claimValue
  ) {
    console.log(
      `🚦 Added custom claim [${claimKey}: ${claimValue}] for user [${uid}].`
    );
  }
  
  export function badWebhookSecret(error) {
    console.error(
      '❗️[Error]: Webhook signature verification failed. Is your Stripe webhook secret parameter configured correctly?',
      error.message
    );
  }
  
  export function startWebhookEventProcessing(id, type) {
    console.log(`⚙️ Handling Stripe event [${id}] of type [${type}].`);
  }
  
  export function webhookHandlerSucceeded(id, type) {
    console.log(`✅Successfully handled Stripe event [${id}] of type [${type}].`);
  }
  
  export function webhookHandlerError(error, id, type) {
    console.error(
      `❗️[Error]: Webhook handler for  Stripe event [${id}] of type [${type}] failed:`,
      error.message
    );
  }