tot_range = 500


data = open(r"./MHEALTHDATASET/mHealth_subject1.log",
            "r").read().split("\n")[:tot_range]

for i in range(len(data)):
    data[i] = list(map(float, data[i].split('\t')))
    data[i] = str(abs(data[i][2]))
st = ",".join(data)

file = open(r'output.txt', 'w')
file.write(st)
file.close()


data = open(r"./MHEALTHDATASET/mHealth_subject2.log",
            "r").read().split("\n")[:tot_range]

for i in range(len(data)):
    data[i] = list(map(float, data[i].split('\t')))
    data[i] = str(abs(data[i][2]))
st = ",".join(data)

file = open(r'output1.txt', 'w')
file.write(st)
file.close()


data = open(r"./MHEALTHDATASET/mHealth_subject3.log",
            "r").read().split("\n")[:tot_range]

for i in range(len(data)):
    data[i] = list(map(float, data[i].split('\t')))
    data[i] = str(abs(data[i][2]))
st = ",".join(data)

file = open(r'output2.txt', 'w')
file.write(st)
file.close()
