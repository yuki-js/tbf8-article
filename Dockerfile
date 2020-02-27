FROM ubuntu:latest

RUN apt-get update && apt-get upgrade -y && apt-get install -y cmake pkg-config libssl-dev git gcc build-essential clang libclang-dev curl || apt-get install -f || true
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
ENV PATH="/root/.cargo/bin:$PATH"
RUN rustup default stable
RUN rustup update nightly && rustup target add wasm32-unknown-unknown --toolchain nightly
ADD . /certstore
WORKDIR /certstore
RUN cargo build --release

EXPOSE 9944/tcp
EXPOSE 30333/tcp
EXPOSE 9933/tcp
EXPOSE 9955/tcp
EXPOSE 5353/udp
EXPOSE 48633/udp
CMD ["/certstore/target/release/node-template", "--unsafe-ws-external", "--validator", "--chain", "/certstore/customspec.json", "--rpc-cors", "all", "--bootnodes", "/dns4/nb.yasui.mynumber.dev/tcp/30333/p2p/Qmc3h5BonDEzehzzozjQVpx2as8iNGpUPfenpA6aWUG4S1"]