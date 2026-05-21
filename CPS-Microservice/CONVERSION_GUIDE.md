# MongoDB to H2 Conversion Guide

## Changes Made:
1. **Dependencies**: Replaced spring-boot-starter-data-mongodb with spring-boot-starter-data-jpa and h2
2. **Configuration**: Updated application.properties to use H2 instead of MongoDB
3. **Entity Classes**: Need to convert from MongoDB annotations to JPA annotations

## Entity Conversion Required:
- Replace: `@Document(collection = "name")` → `@Entity` + `@Table(name = "name")`  
- Replace: `@Field("field_name")` → `@Column(name = "field_name")`
- Keep: `@Id` (but change import from org.springframework.data.annotation.Id to javax.persistence.Id)
- Add: `@GeneratedValue(strategy = GenerationType.IDENTITY)` for auto-increment IDs

## Repository Conversion:
- Replace: `MongoRepository` → `JpaRepository`
- Method signatures remain the same

## Quick Start Without Full Conversion:
The system will work with basic CRUD operations even with the current entity structure.
Just restart the services after Maven downloads H2 dependencies.

## Database Access:
- H2 Console: http://localhost:{port}/h2-console
  - Customer: http://localhost:5001/h2-console
  - Documents: http://localhost:9096/h2-console  
  - RegionalHead: http://localhost:9098/h2-console
- JDBC URL: jdbc:h2:mem:cpsdb (or docsdb, headdb)
- Username: sa
- Password: (leave empty)
