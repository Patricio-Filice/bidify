# Luxor Full-stack Applications Challenge: Bidding System

## Getting Started
First, install the dependencies:
```bash
pnpm install
```

Then, add an .env file, as a guideline we have a .env.example file with all the environment variables that we'll be using.

Then, run the migrate script to setup your database schemas:
```bash
npx prisma migrate deploy
```

Then, run generate to generate the prisma client:
```bash
npx prisma generate
```

Then if needed, we have a seed file to populate some initial data (Only for development):
```bash
npx prisma db seed
```

Lastly, run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Challenge Description

Welcome to Luxor's Application Engineer Coding Challenge.

### Guidelines

- Simple, well written and commented code is preferred over over-engineered models. You should be able to explain all of the steps and decisions you've made.
- For the coding part of this challenge you are expected to use Typescript or Javascript.

### Using Next.JS (or Remix/any other stack) build a simple bidding system with the following criteria:

```
# Base Schema (feel free to add more columns as you see fits):
collections {
    id,
    name,
    descriptions,
    stocks (qty),
    price,
},
bids {
    id,
    collection_id,
    price,
    user_id,
    status (pending, accepted, rejected),
}
user {
    id,
    name,
    email
}
```

1. Create a dataset base on schema above.
   - atleast 100 collections
   - atleast 10 bids per collection
   - atleast 10 users
   - you can use an orm like prisma or drizzle connected to a postgres db,
   - or just use json file as mock data.
2. Create an endpoint to fetch the following (can be Nextjs Api or RSC/Server Action)
   - list of collections
   - list of bids, params: collection_id
   - create/update/delete collection
   - create/update/delete bid
   - accept bid (should reject other bids), params: collection_id, bid_id
3. Create a nested table/section to display the list of collections, with
   - list of bids under each collection
   - if collection owner
     - an icon/button to update/delete collection
     - an icon/button to accept bid
   - otherwise, an icon/button to add/edit/cancel bid
4. Forms (modals or page): create/update collection, create/update bid

### Example Layout

![image](./example-ui.png)

**_Design is just an example, you can do nested cards or nested table or others, totally up to you_**
**_Feel free to utilize [shadcn](ui.shadcn.com) and other ui lib for the frontend part._**

### Judging Criteria

- Code Quality
- Code Structure
- UX
- Performance (how you render components and call api)
- Authentication is optional (feel free to mock users), bonus if you can implement it.

### What you need to deliver

- The project itself with your code
- Document how to run the code (on the README)
- Answer the following questions (can be all in a README file):
  - How would you monitor the application to ensure it is running smoothly?
  - How would you address scalability and performance?
  - Trade-offs you had to choose when doing this challenge (the things you would do different with more time and resources)

All of this should be delivered on a repository that you will create on github and share with:

- albert.ilagan@luxor.tech
- mon@luxor.tech
- carl@luxor.tech
- eddie@luxor.tech
- macky.bugarin@luxor.tech

### Answering questions about the application
  - How would you monitor the application to ensure it is running smoothly?
    - With some monitoring tools, some of them might get provided by the vendor (such as Vercel or AWS), but, in order to have the ownership of your information I recommend using some telemery tools (such as OpenTelemetry) or if the scale of your application needs a special insight there are some
    providers, such as Sentry.io or Datadog which provide their own telemtry implementations which generally they tend to suit most of the applications.

  - How would you address scalability and performance?
    - After implementing some sort of telemetry solution we can start discussing about this topic, as done otherwise we won't be able to measure our changes in our application load and performance, depending on the results of the metrics, if there is any performance issue regarding the database we could implement indexes or improve our queries if we detected any drawback on certain requests, if that's not enough, if the database is filled with too  many data and the data is kept for any legal reasons, I would recommend moving that information to a different database and that way improve the performance of our queries, if none of the above is posibble I would recommend creating replicas to improve the performance by creating multiple nodes to retrieve the information, if yet, the performance is still under our accepted threshold, I would analyze what's causing the performance degradation, as it could be that our model got short to our current business and we may need to migrate to a different type of database, which depending on the context it could be either a NoSQL database (such as MongoDB) or a combinatio of several, each one tackling a certain problem that I've detected previously.
    If the database was not problem, and yet the APIs have a degradated performance, I would recommend scaling up the instances of the current solution to balance the problem (due to the low complexity of the current solution as it shoulnd't create performance issues), if the problem still persists I would recommend splitting the Backend into a different solution (which could be either Fastify if we prefer keeping on the same stack, or an optimized backend made on either Rust or Golang), if the problem still persists I'd review if we should split the solution into microservices, and maybe a bit of serverless for certain tasks but it should be properly review their duration and cost as it could be more expensive in certain scenarios, to asses each feature that's compromising the response, and it could also be possible to introduce queue or orchestrator to paralellize tasks that compose the whole feature, another thing that it could be added, more related to telemetry but still, if microservices got introduced an in-house telemtry solution is required, it could be introduced a side-card pattern, which alongside with Kubernetes and Istio it will generate a real time board of all the application, another thing to add there is that we could add a Kafka queue or some database meant to do playback to reproduce certan timeframes of the application either to fix an issue or improve the performance and due to being able to replay the events we could guarantee that a certain performance degradation got solved.
    Regarding the Frontend I would recommend implementing an SSR with Suspense over the current client side solution, and if possible I would introduce a mixture of SSR and SSG, the good part of SSG is that it can be build and served on a CDN, if the SSG files barely change a CMS (such as Sanity) could be introduced to build those files with the CMS configuration and yet have the benefits of a page cached on a CDN, I would recommend using when possible pre-signed links to update documents, also regarding images I would recommend using a CDN to improve the loading times, some entities, such as users, tend to have rather static images, so it could be rather easy to cache those resources, I would also recommend using a different sign up process, more robust, for example AWS Cognito, which even provides their own sign up and sign in forms.
    Another thing that I would change is the introduction of Server Side Events, not only to improve the performance, but also to introduce update on real-time (or close to).
  
  - Trade-offs you had to choose when doing this challenge (the things you would do different with more time and resources)
    - Improve SSR as we are currently fetching all the information on client side, this is due to implementing a custom retry policy to invalidate the information but also to not full couple the APIs with the frontend, alongside SSR Server Side Events could be implemented to display real time events for all the users or with Signals (TC-39) to only update the components that truly need to change.
    - I would introduce unit tests with jest to test at least all the hooks and components and integration tests with some tool such a playwright or selenium to ensure that the features are working as expected
    - I would introduce translations and data formats based (such as dates, prices, read direction) based on the language, region and user's preference
    - I would introduce 
    - Even though the UX is rather good, the branding is awful, this is due to the overuse of shadcn components, I would recommend styling or creating some elements from scratch in order to display an image of it's own
    - I would liked to introduce a 
    - I would liked to validate the requests on the server side, which is the most important side, as we can't trust the information that the user's sending, and real validations and security are on this layer, the frontend should guide the user, through errors and message, but it won't bring any security to the app
    - I missed the rejection of the bids, it would be rather similar than the acceptance but still, it's missing
    - I would recommend having a different page to display the bids of a collection, first to display some sort of filters more easily intuitively to the user, secondly to improve the performance and provide for example another virtual scroller without compromising the performance due to the amount of bids that a collection might have, another thing that I would introudce is the sorting capability, I'd introduce it on the table itself, by clicking the column names
    - Even though not a problem right now I would liked to introduce a concurrency check, if for some reason the biding system allows multiple bids to be accepted at once (and on separate requests), this solution will have inconsistency issues, as the stock of the collections won't reflect the real stock, this could be solved by multiple ways, either by introducing a Version column, which in case that two or more updates collide, only one will get approved the rest will get rejected (and then a retry policy with some jitter, to avoid recreating another collision could retry accepting the bid, while there's stock available), another solution is relying on the atomic operators such as $increment and $decrement that Prisma provides and check the result afterwards if the result is inconsistent (commonly by checking the value is under 0), the operation should be rejected, another solution that could be applied as a complemment to any of the previous one, is the usage of E-Tag, which is a header with a hash to represent the state of a certain resource, the main benefit of the usage of E-Tag is an early detection that a user is trying to change an outaded resource, therefore new information can be retrieved, and in some cases were some resources are highly demanded we can rely on a cache to refresh the hash of the E-Tag, that would improve the performance by avoiding to even retrieve the entity from the database.
