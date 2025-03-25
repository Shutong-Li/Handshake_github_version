# Copyright (C) 2025 HandShake
# Licensed under the Apache License, Version 2.0.
# See LICENSE file for details. 

#!/bin/bash

echo "Running Python tests with Django..."
python manage.py test
django_exit_code=$?

if [ $django_exit_code -ne 0 ]; then
	echo "Python tests failed."
	exit $django_exit_code
fi

echo "Running JavaScript tests with Jest..."
npm run test -- --ci --maxWorkers=4
jest_exit_code=$?

if [ $jest_exit_code -ne 0 ]; then
	echo "JavaScript tests failed."
	exit $jest_exit_code
fi

echo "All tests passed!"
exit 0

