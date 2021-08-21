default:
	@echo "An explicit target is required"

install:
	cd $(FRONTEND) && npm install
	cd $(BACKEND) && python -m venv venv/
	cd $(BACKEND)/venv/Scripts && activate && cd.. && cd.. && pip install -r requirements.txt
	cd $(BACKEND)/venv/Scripts && activate && python -m spacy download en_core_web_sm
	cd $(BACKEND)/venv/Scripts && activate && python -m spacy download fr_core_news_sm
	cd $(BACKEND)/venv/Scripts && activate && python -m spacy download es_core_news_sm
start:
	make -j 2 start-frontend FRONTEND=react-frontend start-backend BACKEND=flask-backend
start-frontend:
	cd $(FRONTEND) && npm run start
start-backend:
	cd $(BACKEND)/venv/Scripts && activate && cd.. && cd.. && flask run
