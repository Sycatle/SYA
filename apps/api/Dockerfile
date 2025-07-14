# apps/api/Dockerfile

FROM rust:1.82-slim

# Installer les dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    build-essential \
    ca-certificates \
    curl \
 && rm -rf /var/lib/apt/lists/*

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier uniquement les fichiers Cargo pour optimiser le cache
COPY Cargo.toml Cargo.lock ./
COPY .env .env

# Préparer les dépendances pour cache Docker
RUN mkdir -p src && echo "fn main() {}" > src/main.rs && \
    cargo build --release && \
    rm -r src

# Copier le reste de l'application
COPY . .

# Compiler le projet
RUN cargo build --release

# Définir le point d'entrée
CMD ["./target/release/api"]
