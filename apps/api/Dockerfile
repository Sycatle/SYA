# apps/api/Dockerfile
FROM rust:1.82-slim

WORKDIR /usr/src/app

# Cache build deps
COPY Cargo.toml ./
RUN mkdir src && echo "fn main() {}" > src/main.rs && cargo build --release
RUN rm -r src

# Copy full source & build
COPY . .
RUN cargo build --release

CMD ["./target/release/api"]
