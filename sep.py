data = open(r"./MHEALTHDATASET/mHealth_subject1.log",
            "r").read().split("\n")[:500]

for i in range(len(data)):
    data[i] = list(map(float, data[i].split('\t')))
    data[i] = str(abs(data[i][2]))
st = ",".join(data)

file = open(r'output.txt', 'w')
file.write(st)
file.close()
