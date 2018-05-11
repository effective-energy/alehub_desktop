#! /bin/bash

set(USE_SNAPPY_DEFAULT 0)
mkdir $HOME/.local
mkdir $HOME/.local/share
mkdir $HOME/.local/share/ale
rm $HOME/.local/share/ale/genesis.hash
rm $HOME/.local/share/ale/genesis.json
cp genesis.hash $HOME/.local/share/ale/
cp genesis.json $HOME/.local/share/ale/
#echo "7c18c65170e1198313afe120ef070210c374ef733b3008e336d37698e5517b64"  >> /Users/ss/.local/share/ale/genesis.hash
#export LD_LIBRARY_PATH=./lib
export DYLD_LIBRARY_PATH="./lib"
export LD_LIBRARY_PATH=./lib
otool -L lib/libsnappy.a
export LDFLAGS='-L/lib'
export WITH_SNAPPY=/lib
export SNAPPY=/lib
./ale-wallet --wconfig ./wallet-config.yaml 12348
