/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// [START presence_sync_function]
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

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
    // db.collection('customers').doc(customer).collection('subscriptions').doc(subscription).
    // get().
    // then(doc => {
    //   if (!doc.exists) {
    //     console.log("sub not found!");
    //   } else {
    //     // console.log("Document data found: " + doc.data());
    //     let data = doc.get().price.data();
    //     console.log(docdata);
    //     let tasksTotal = docdata.price.transform_quantity.divide_by;
    //     let creditUsage = doc.data().metadata.credit_usage;
    //     console.log("Current credits usage: ", creditUsage);
    //     console.log("Credits total: ", tasksTotal);
    //     this.creditsAvailable = tasksTotal - creditUsage;
    //     console.log("Credits available: ", creditsAvailable);
    //   }
    // })
    

    //TODO: ^^
    // Continue only if 
    // Create task only if creditsAvailable > creditsRequired
    // Create task only if creditsAvailable > creditsRequired
    taskPost = {
      name: "Task Name",
      created: admin.firestore.FieldValue.serverTimestamp(),
      task: db.doc('tasks/' + task),
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
  // [END addMessage]
  

  // [START makeUppercase]
  // Listens for new messages added to /messages/:documentId/original and creates an
  // uppercase version of the message to /messages/:documentId/uppercase
  // [START makeUppercaseTrigger]
  // exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
  //     .onCreate((snap, context) => {
  // // [END makeUppercaseTrigger]
  //       // [START makeUppercaseBody]
  //       // Grab the current value of what was written to Firestore.
  //       const original = snap.data().original;
  
  //       // Access the parameter `{documentId}` with `context.params`
  //       functions.logger.log('Uppercasing', context.params.documentId, original);
        
  //       const uppercase = original.toUpperCase();
        
  //       // You must return a Promise when performing asynchronous tasks inside a Functions such as
  //       // writing to Firestore.
  //       // Setting an 'uppercase' field in Firestore document returns a Promise.
  //       return snap.ref.set({uppercase}, {merge: true});
  //       // [END makeUppercaseBody]
  //     });
  // [END makeUppercase]
  // [END all]