#! /bin/bash

mkdir $HOME/.local
mkdir $HOME/.local/share
mkdir $HOME/.local/share/ale
mkdir $HOME/.local/share/ale/linux
rm $HOME/.local/share/ale/genesis.hash
rm $HOME/.local/share/ale/genesis.json
rm -r $HOME/.local/share/ale/linux/*
cp genesis.hash $HOME/.local/share/ale/
cp genesis.json $HOME/.local/share/ale/
cp -av ./* $HOME/.local/share/ale/linux
cd $HOME/.local/share/ale/linux
export DYLD_LIBRARY_PATH="./lib"
export LD_LIBRARY_PATH=./lib
export LDFLAGS='-L/lib'
#export WITH_SNAPPY=/lib
#export SNAPPY=/lib
./ale-wallet --wconfig ./wallet-config.yaml 12348
