

import datetime
import time
import os
import sys
import math

# Get the current date and time
time_now = datetime.datetime.now()

emission_date = "2024-04-24 13:21:00"  # Emission date of the QR code
activation_date = "2024-04-26 13:18:00"  # Activation date of the QR code

# Get the date and time corresponding to the activation and emission dates
time_emission = datetime.datetime.strptime(emission_date, "%Y-%m-%d %H:%M:%S")
time_activation = datetime.datetime.strptime(activation_date, "%Y-%m-%d %H:%M:%S")

# Parameters of the QR code
t = "20052168"
v = "0735"


# Print the parameters of the QR code
print("=====================================")
print("> Parameters of the QR code:")
print("\t- T: ", t)
print("\t- V: ", v)

# Print the current date and time, activation date and emission date
print("======= Date and time information ==========")
print("> Current date and time:\n\t", time_now)
print("> Activation date and time:\n\t", time_activation)
print("> Emission date and time:\n\t", time_emission)

# print the current date, activation date and emission date in epoch format
print("======= Epoch format ==========")
print("> Current date: \t", time_now.timestamp())
print("> Activation date: \t", time_activation.timestamp())
print("> Emission date: \t", time_emission.timestamp())

# print the current date, activation date and emission date in epoch format but considering minutes
print("======= Epoch format in minutes ==========")
print("> Current date: \t", time_now.timestamp() / 60)
print("> Activation date: \t", time_activation.timestamp() / 60)
print("> Emission date: \t", time_emission.timestamp() / 60)

# Subtract the given number of days/years from all the dates
days_delta = int(v)
seconds_delta = days_delta * 24 * 60 * 60

time_now_minutes_with_delta = (time_now.timestamp() - seconds_delta) / 60
time_activation_minutes_with_delta = (time_activation.timestamp() - seconds_delta) / 60
time_emission_minutes_with_delta = (time_emission.timestamp() - seconds_delta) / 60

# Print the current date and time, activation date and emission date in epoch format but considering minutes
print("======= Epoch format in minutes (with delta) ==========")
print("> Current date: \t", time_now_minutes_with_delta)
print("> Activation date: \t", time_activation_minutes_with_delta)
print("> Emission date: \t", time_emission_minutes_with_delta)

# Print the difference between the current date, activation date and emission date in minutes with delta and the t parameter
print("======= Difference between the current date and the activation date in minutes and T parameter ==========")
print("> Difference between the current date and the activation date: ", time_now_minutes_with_delta - int(t))
print("> Difference between the current date and the emission date: ", time_now_minutes_with_delta - int(t))
print("> Difference between the activation date and the emission date: ", time_activation_minutes_with_delta - int(t))
