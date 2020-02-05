FROM ubuntu:latest

RUN apt-get update && apt-get upgrade -y && apt-get install -y cmake pkg-config libssl-dev git gcc build-essential clang libclang-dev curl || apt-get install -f || true
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
ENV PATH="/root/.cargo/bin:$PATH"
RUN rustup default stable
RUN rustup update nightly && rustup target add wasm32-unknown-unknown --toolchain nightly
ADD . /certstore
WORKDIR /certstore
RUN cargo build --release

EXPOSE 9944
CMD ["/certstore/target/release/node-template", "--dev", "--ws-external"]