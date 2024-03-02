# fs-atom

A small experiment, where I tried to find out if a file system - ext4 in my case - protects against concurrent read and writes.

Seemingly not.

## Try out
```sh
# write the char 'i' 31 times plus a '\n' every 100 ms to data.txt
node write.js --chunk-size 32 --delay 100 --char i data.txt
# in another shell...
# read 32 bytes every 50 ms from the file data.txt 
node read.js --chunk-size 32 --delay 50 data.txt
```
