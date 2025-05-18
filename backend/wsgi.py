import sys
path = '/home/ben1231115/app'
if path not in sys.path:
    sys.path.append(path)

from app import app as application