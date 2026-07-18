StreamTune – Music Streaming Platform

Overview

StreamTune is a full-stack music streaming platform inspired by modern music applications. It allows users to listen to songs, explore albums, and enjoy a seamless music streaming experience. The application is built using Spring Boot and React and is deployed on AWS with Kubernetes for scalability, auto-healing, and efficient resource management.

Features

- Music streaming functionality
- Browse songs and albums
- Responsive and interactive user interface
- Full-stack architecture using Spring Boot and React
- Containerized application using Docker
- Kubernetes-based deployment with:
  - Auto Scaling
  - Auto Healing
  - Load Management
- Cloud deployment on AWS
- High availability and fault tolerance

Tech Stack

Frontend

- React.js
- HTML
- CSS
- JavaScript

Backend

- Spring Boot
- REST APIs
- Java

DevOps & Cloud

- Docker
- Kubernetes
- AWS
- Nginx

System Architecture

                Users
                  |
               React
             Frontend
                  |
               Nginx
                  |
            Spring Boot APIs
                  |
              Kubernetes
        (Scaling & Auto Healing)
                  |
                 AWS
                  |
           Music Streaming Service

Project Structure

StreamTune/
│
├── frontend/
│   └── React Application
│
├── backend/
│   └── Spring Boot Application
│
├── kubernetes/
│   ├── Deployments
│   ├── Services
│   └── Configuration Files
│
├── nginx/
│   └── Nginx Configuration
│
└── README.md

Installation

Clone the Repository

git clone <repository-url>
cd StreamTune

Frontend Setup

cd frontend
npm install
npm run dev

Backend Setup

cd backend
./mvnw spring-boot:run

Docker

docker-compose up --build

Kubernetes Deployment

kubectl apply -f .

Verify deployment:

kubectl get pods
kubectl get services

Scalability

StreamTune uses Kubernetes to provide:

- Automatic scaling during high traffic.
- Auto-healing when pods fail.
- Efficient resource utilization.
- High availability of services.
- Improved reliability for music streaming.

Future Enhancements

- Playlist management
- Search functionality
- User authentication and authorization
- Personalized recommendations
- Premium subscriptions
- Real-time analytics
- Offline music support

Learning Outcomes

Through this project, I gained practical experience in:

- Full Stack Development
- Spring Boot REST APIs
- React Development
- Docker Containerization
- Kubernetes Orchestration
- AWS Deployment
- Nginx Configuration
- Scalable Cloud Architectures
- High Availability Systems

Author

Sathish

Final Year Computer Science Engineering Student

---

StreamTune – Delivering scalable and seamless music streaming experiences.
