> we'll adopt a more standardized approach eventually like RFCs and ADRs

## decisions

- use the hexagonal architecture
  ![hexagonal architecture diagram](/assets/DomainDrivenHexagon.png)
  [image source](https://github.com/Sairyss/domain-driven-hexagon/blob/master/README.md)
- adopt [Yoni Goldberg's Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices), but maintain a fork of this for cases where our practices diverge
- use graphql instead of REST
  - we will adopt most of our best practices here from the excellent [Production Ready GraphQL book](https://book.productionreadygraphql.com/)
  - the motivation behind this is due to the a few things, but is not without reservations
  - pros
    - RPC language that has matured and has excellent tooling for code generation and input validation
    - The semantics of REST are very crude often leading to large "update" statements that try to account for all the possible permutations of valid updates while you can use mutations to get more granularity based on specific actions and specific inputs (too many optional arguments here are a code smell). More specific actions convey intent - if we have a clear intent we can validate the action instead of the change to the data which makes invariants easier to enforce and reduces the risk of bugs.
    - clients can query only what they want
    - decent support in tooling and schema for union types allowing backends to convey clear expectations about known errors the UI may want to convey to the client (and localize) - this will complement our functional error handling well
  - cons
    - caching may be harder, may not be the best choice for scenarios where this plays an important role
    - mutations and queries often return too much data if boundaries are poorly defined
    - composition via resolvers to fetch related data couples the implementation to graphql and is often used to serve overly generic use-cases that require unecessarily complex authorization logic
      - we'll prefer use-case driven queries for the sake of simplicity and maintainability - while it's probably okay for a query to serve multiple clients it may be a good indicator that we've gone too far if field-level authorization is required
    - authorization complexity can increase especially if queries do not correspond with specific use cases
    - while union types are great for supporting our functional error handling approach
- unit of work pattern
  - while I'm sometimes critical of this pattern as persistence concerns somewhat bleed into your application service it's the best way I know of to ensure domain events and changes to aggregates are atomic
  - if the unit of work pattern is being used across aggregates it _may_ be a sign that you need to combine them as generally it's best to keep mutations/commands to affected aggregates 1:1 or you introduce additional complexity
- transactional outbox pattern
- functional error handling
  - https://khalilstemmler.com/articles/enterprise-typescript-nodejs/functional-error-handling/
- performance testing
- adopt OPA for policy enforcement (potentially with OPAL, but we won't bother on this initial project)
- we'll use postgres for now given its familiarity, there are a couple of postgres-compatible solutions such as YugabyteDB or CockroachDB that can scale horizontally
- We'll use the Prisma ORM - while I'm not a huge fan of ORMs (especially the active record pattern) I've heard good things about this ORM and want to give it a try given my preference for something simple like knex doesn't seem to be shared by the majority
  - this gives us less coupling to any particular relational ACID database
  - while ORMs often hinder performance we'll be implementing an administrative API here which won't be on the performance critical path
- switch to Fastify and Mercurius (this will also require replacing related express middleware) - this gives us benefits of graphql without as significant of a performance hit predicated on the idea that we will use graphql in such a way that we will get significant benefits from graphql-jit. We could use WS or SSE to get an even higher number of ops per second, but we'll prefer a more stateless approach for this server
## still to be decided

- functions or aggregate classes and what do they return
  - I like the idea of event sourcing even when it may not make sense to persist the events themselves as it encourages separation of the invariant enforcement from changing the data - things we'll need to figure out where they go
    - the updated aggregate
    - the event source events (events that mutate state)
    - domain events (events we want to publish for any interested consumers e.g. in an authz service we might want to notify interested parties when a user has been deleted)
- ID generation (maybe not as relevant for this part of the system although will be very important for messages and ordering - ideally we use a consistent ID type across entities)
- come up with an actual name - this is no longer going to be just a "starter" project, but an actual example / real implementation
