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

WORKDIR /usr/src/app

# Étape 1 – Préparer le cache
COPY Cargo.toml Cargo.lock ./

# Dummy pour le cache uniquement
RUN mkdir -p src && echo "fn main() {}" > src/main.rs && \
    cargo build --release && \
    rm -r src

# Étape 2 – Copier le code réel
COPY . .

# 🔥 Recompile en forçant la recompilation propre (clean)
RUN cargo clean && cargo build --release && \
    cp target/release/api /usr/local/bin/sya-api

CMD ["/usr/local/bin/sya-api"]
