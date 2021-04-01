from mpl_toolkits import mplot3d
import numpy as np
import matplotlib.pyplot as plt
import random

if __name__ == "__main__":
	# patient_no = random.randint(1,10)
	data = open(r"C:\Users\gupta\Downloads\MHEALTHDATASET\db1", "r").read().split("\n")[:150]
	avg = []
	fig = plt.figure(1)
	no_of_sensors = 3
	for i in range(len(data)):
		plt.clf()
		data[i] = list(map(float, data[i].split('\t')))
		su = 0  
		for j in range(5, 5+no_of_sensors):
			su += data[i][j]

		avg.append(su/no_of_sensors)
		avg = avg[-50:]
		all_avg = sum(avg)/len(avg)
		ma = max(avg)
		mi = min(avg)

		plt.plot(avg)
		plt.ylabel("Left-Ankle Sensor")
		plt.axis([0, 50, -3.0, -2.0])
		x = 40
		y = -2.15
		if(len(avg) > 3):
			if(abs(avg[-2] - avg[-1]) > 0.7*(ma-mi)):
				plt.text(x, y, "Abrupt", color = "red")
			elif(1.1*all_avg < avg[-1] and avg[-1] > avg[-2] and avg[-2] > avg[-3]):
				plt.text(x, y, "Incremental", color = "g")
			elif(1.1*all_avg > avg[-1] and avg[-1] < avg[-2] and avg[-2] < avg[-3]):
				plt.text(x, y, "Decremental", color = "g")
			else:
				plt.text(x, y, "Recurring", color = "g")
		else:
			plt.text(x, y, "Collecting Data", color = "g")

		plt.pause(0.001)

	plt.show()
