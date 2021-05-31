/*
 * Copyright 2020 Stripe, Inc., Google, IT Solver
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

// [START presence_sync_function]
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Stripe = require('stripe');
const logs = require('./logs');
const config = require('./config');

admin.initializeApp();

const db = admin.firestore();

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2020-08-27',
  // Register extension as a Stripe plugin
  // https://stripe.com/docs/building-plugins#setappinfo
  appInfo: {
    name: 'Firebase firestore-stripe-subscriptions-functions',
    version: '0.0.1',
  },
});

exports.updateSubMetaData = functions.https.onRequest(async (req, res) => {
  const subscription = await stripe.subscriptions.update(
    'sub_JQke3iznpc79Hb',
    {metadata: {credit_usage: '100'}}
  );
  console.log(subscription)
  res.json({result: `Subscription updated`});
});

/**
 * A webhook handler function for the relevant Stripe events.
 */
 export const handleWebhookUpdates = functions.handler.https.onRequest(
  async (req, resp) => {
    const relevantEvents = new Set([
      'customer.subscription.updated',
    ]);

    // Instead of getting the `Stripe.Event`
    // object directly from `req.body`,
    // use the Stripe webhooks API to make sure
    // this webhook call came from a trusted source
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        req.headers['stripe-signature'],
        config.stripeWebhookSecret
      );
    } catch (error) {
      logs.badWebhookSecret(error);
      resp.status(401).send('Webhook Error: Invalid Secret');
      return;
    }

    if (relevantEvents.has(event.type)) {
      logs.startWebhookEventProcessing(event.id, event.type);
      try {
        switch (event.type) {
          case 'customer.subscription.created':
          case 'customer.subscription.updated':
            const subscription = event.data.object;
            await manageSubscriptionStatusChange(
              subscription.id,
              subscription.customer,
              event.type === 'customer.subscription.created'
            );
            break;
          default:
            logs.webhookHandlerError(
              new Error('Unhandled relevant event!'),
              event.id,
              event.type
            );
        }
        logs.webhookHandlerSucceeded(event.id, event.type);
      } catch (error) {
        logs.webhookHandlerError(error, event.id, event.type);
        resp.json({
          error: 'Webhook handler failed. View function logs in Firebase.',
        });
        return;
      }
    }

    // Return a response to Stripe to acknowledge receipt of the event.
    resp.json({ received: true });
  }
);

// Replace with your cloud functions location
//const functionLocation = 'australia-southeast1';
// [START addTask]
// Take the task parameter passed to this HTTP endpoint and insert it into 
// Firestore under the path /tasks/:taskId/task
// [START addTaskTrigger]



exports.addTask = functions.https.onRequest(async (req, res) => {
  // [END addTaskTrigger]
    // Grab the task parameter.
    const customer = req.query.customer;
    const subscription = req.query.subscription;
    const task = req.query.task;
    const taskname = req.query.taskname;
    // TODO: check subscriber has credits available before posting task to Bonney

    // [START adminSdkAdd]
    // Push the new task into Firestore using the Firebase Admin SDK.

    // Read task credits required
    db.collection('tasks').doc(task).
    get().
    then(doc => {
      if (!doc.exists) {
        console.error("task not found!");
      } else {
        // console.log("Document data found: " + doc.data());
        console.log("Credits required to do task: ", doc.data().credits);
        this.creditsRequired = doc.data().credits;
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });
    // Read credits usage cap
    // Get all subscriptions for the customer
    db.collection('customers')
    .doc(customer)
    .collection('subscriptions')
    .doc(subscription).get().then(doc => {
      if (!doc.exists) {
        console.log('subscription missing from firestore');
      } else {
      // In this implementation we only expect one Subscription to exist
      const priceData = doc.price;
      let creditUsage = doc.metadata.credit_usage;
      let tasksTotal = priceData.transform_quantity.divide_by;
      this.creditsAvailable = tasksTotal - creditUsage;
      console.log("Credits available: ", creditsAvailable);
      console.log("Credit usage:", creditUsage)
      console.log("Tasks total:", tasksTotal)
    }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });
    // Continue only if 
    // Create task only if creditsAvailable > creditsRequired
    // Create task only if creditsAvailable > creditsRequired
    const taskPost = {
      name: "Task Name",
      created: admin.firestore.FieldValue.serverTimestamp(),
      task: db.doc('tasks/' + task)
    };
    const writeResult = await admin.firestore().collection('customers').doc(customer).collection('subscriptions').doc(subscription).collection("tasks").add(taskPost);

    // Update creditUsage
    const creditRef = admin.firestore().collection('customers').doc(customer).collection('subscriptions').doc(subscription);
    const creditUsage = creditRef.update({
    "metadata.credit_usage" : admin.firestore.FieldValue.increment(1)});
    // [END adminSdkAdd]
    // Display a message that we've successfully written the task
    res.json({result: `Task with ID: ${writeResult.id} added, and used up ${this.creditsRequired} credits. Credits available: ${this.creditsAvailable} of tasks total: ${this.tasksTotal}. `});
  });